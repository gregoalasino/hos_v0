'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Check, CheckCircle, XCircle, Loader2,
} from 'lucide-react';
import type { Upsell, ReferralCode } from '@/types';
import { downloadICS } from '@/lib/ics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { BookingHeader } from '@/components/booking/BookingHeader';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookingMobileSummary } from '@/components/booking/BookingMobileSummary';
import { BookingNavigation } from '@/components/booking/BookingNavigation';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';

// ── Class photo mapping ──────────────────────────────────────────────────────
const CLASS_PHOTOS: Record<string, string> = {
  'Sunrise Vinyasa':        '/images/yoga/NE8A7702%201.webp',
  'Power Flow':             '/images/yoga/IMG_8420%201.webp',
  'Yin Yoga':               '/images/yoga/IMG_7491%201.webp',
  'Restorative Yoga':       '/images/yoga/IMG_7526%201.webp',
  'Pranayama & Meditación': '/images/sanctuary/271A0873_websize%201.webp',
  'Breath & Movement':      '/images/yoga/IMG_8664%201.webp',
  'Gentle Flow':            '/images/yoga/IMG_7538%201.webp',
  'Hatha Foundations':      '/images/yoga/IMG_7539%201.webp',
  'Ashtanga Primary':       '/images/yoga/NE8A7854%201.webp',
  'Detox Yoga':             '/images/yoga/IMG_8420%201.webp',
  'Vinyasa Krama':          '/images/yoga/NE8A7702%201.webp',
  'Tantra Vinyasa':         '/images/yoga/IMG_7526%201.webp',
  'Deep Stretch & Breath':  '/images/yoga/IMG_7491%201.webp',
  'Vinyasa Flow':           '/images/yoga/IMG_8664%201.webp',
};
function getClassPhoto(name: string): string {
  return CLASS_PHOTOS[name] ?? '/images/yoga/IMG_8693%201.webp';
}

type Props = {
  classId: string;
  className: string;
  instructor: string;
  startsAt: string;
  durationMinutes: number;
  capacity: number;
  spotsRemaining: number;
  priceUsd: number;
  location: string;
  description: string;
  color?: string;
  upsells: Upsell[];
};

const personalSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
  isHotelGuest: z.boolean(),
  cloudbedsRef: z.string().optional(),
});

type PersonalData = z.infer<typeof personalSchema>;

type PackType = 'dropin' | 'pack5' | 'pack10';

const PACKS: { id: PackType; name: string; classes: number; price: number; saving?: string }[] = [
  { id: 'dropin', name: 'Drop-in',   classes: 1,  price: 20 },
  { id: 'pack5',  name: 'Pack of 5', classes: 5,  price: 75,  saving: 'Save $25' },
  { id: 'pack10', name: 'Pack of 10', classes: 10, price: 130, saving: 'Save $70' },
];

type BookingError = 'no_spots' | 'too_late' | 'generic' | null;

async function validateReferralCodeFromDB(
  code: string,
  subtotal: number,
  classPrice: number,
): Promise<{ valid: boolean; code?: ReferralCode; error?: string }> {
  try {
    const res = await fetch('/api/referral-codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    const data = await res.json();
    if (!data.valid) return { valid: false, error: data.error };

    // A class-pack code waives the class fee. Model it as a fixed discount equal
    // to the class price so the existing discount math leaves upsells charged.
    if (data.kind === 'pack') {
      const packCode: ReferralCode = {
        id: code,
        code: code.toUpperCase(),
        partnerName: 'Class pack',
        description: data.description ?? 'Class pack applied',
        benefitType: 'fixed',
        discountFixed: classPrice,
        isActive: true,
        usageCount: 0,
        minPurchaseUsd: 0,
        createdAt: new Date(),
      };
      return { valid: true, code: packCode };
    }

    const rc: ReferralCode = {
      id: code,
      code: code.toUpperCase(),
      partnerName: data.partnerName ?? '',
      description: data.description ?? '',
      benefitType: data.benefitType,
      discountPercent: data.discountPercent ?? undefined,
      discountFixed: data.discountFixed ?? undefined,
      freeUpsellId: data.freeUpsellId ?? undefined,
      isActive: true,
      usageCount: 0,
      minPurchaseUsd: 0,
      createdAt: new Date(),
    };
    return { valid: true, code: rc };
  } catch {
    return { valid: false, error: 'invalid' };
  }
}

/** Returns the discount amount in USD given an applied code and subtotal. */
function computeDiscount(code: ReferralCode, subtotal: number, upsells: Upsell[]): number {
  if (code.benefitType === 'percentage') {
    return parseFloat(((subtotal * (code.discountPercent! / 100))).toFixed(2));
  }
  if (code.benefitType === 'fixed') {
    return Math.min(code.discountFixed!, subtotal);
  }
  if (code.benefitType === 'free_upsell') {
    const upsell = upsells.find(u => u.id === code.freeUpsellId);
    return upsell ? Math.min(upsell.priceUsd, subtotal) : 0;
  }
  return 0;
}

// ─── Step headings ────────────────────────────────────────────────────────────
const STEP_HEADINGS: Record<number, string> = {
  1: 'Your class',
  2: 'Add to your practice',
  3: 'Your details',
  4: 'Payment',
};

// ─── Category derivation (mirrors /yoga's CATEGORY_STYLES; kept local for now) ─
function getCategoryLabel(name: string): string {
  if (['Sunrise Vinyasa', 'Power Flow', 'Breath & Movement', 'Vinyasa Flow', 'Vinyasa Krama', 'Detox Yoga'].includes(name)) return 'Vinyasa';
  if (['Yin Yoga', 'Yin & Restore', 'Restorative Yoga', 'Deep Stretch & Breath'].includes(name)) return 'Yin & Restorative';
  if (['Gentle Flow', 'Hatha Foundations'].includes(name)) return 'Hatha';
  if (['Ashtanga Primary'].includes(name)) return 'Ashtanga';
  if (['Pranayama & Meditación', 'Meditation', 'Tantra Vinyasa'].includes(name)) return 'Meditation';
  return 'Yoga';
}

// ─── Editorial input style (border-bottom only, no bg, no rounded) ───────────
// Used in Step 3. `!` modifiers override the shadcn Input defaults reliably.
const editorialInput = [
  '!rounded-none !border-0 !border-b !border-ink/30',
  '!bg-transparent !px-0 !py-3 !shadow-none !h-auto',
  'focus-visible:!ring-0 focus-visible:!ring-offset-0',
  'focus-visible:!border-ink',
  '!transition-colors',
].join(' ');

// ─── Demo mode ────────────────────────────────────────────────────────────────
// When NEXT_PUBLIC_BOOKING_DEMO_MODE === 'true', the booking flow does NOT hit
// /api/bookings/create. Instead, it generates a mock reference client-side and
// jumps straight to the confirmation screen. Used for previewing the success
// state in demos when the Supabase backend isn't fully wired up.
//
// Default: off. Set to 'true' in .env.local to enable. Always leave OFF in prod.
const DEMO_MODE = process.env.NEXT_PUBLIC_BOOKING_DEMO_MODE === 'true';

function mockBookingReference(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const code = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HOS-${y}${m}${day}-${code}`;
}

export default function BookingFlow({
  classId, className, instructor, startsAt,
  durationMinutes, capacity, spotsRemaining,
  priceUsd, location, description, color, upsells,
}: Props) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<Set<string>>(new Set());
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [packType, setPackType] = useState<PackType>('dropin');
  const [bookingRef, setBookingRef] = useState('');
  const [appliedCode, setAppliedCode] = useState<ReferralCode | null>(null);
  const [codeStatus, setCodeStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [codeErrorKey, setCodeErrorKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingError, setBookingError] = useState<BookingError>(null);

  const classDate = new Date(startsAt);
  const isFree = priceUsd === 0;
  const activeUpsells = upsells.filter(u => u.isActive);

  const selectedUpsellsList = useMemo(
    () => activeUpsells.filter(u => selectedUpsellIds.has(u.id)),
    [selectedUpsellIds, activeUpsells],
  );

  const subtotalUpsells = selectedUpsellsList.reduce((acc, u) => acc + u.priceUsd, 0);
  const subtotal = priceUsd + subtotalUpsells;
  const discountAmount = appliedCode ? computeDiscount(appliedCode, subtotal, upsells) : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const isTotalFree = total === 0;

  async function handleApplyCode() {
    const codeStr = form.getValues('referralCode') ?? '';
    if (!codeStr.trim()) return;
    setCodeStatus('loading');
    const result = await validateReferralCodeFromDB(codeStr, subtotal, priceUsd);
    if (result.valid && result.code) {
      setAppliedCode(result.code);
      setCodeStatus('success');
      setCodeErrorKey('');
    } else {
      setAppliedCode(null);
      setCodeStatus('error');
      setCodeErrorKey(result.error ?? 'invalid');
    }
  }

  function codeErrorMsg(key: string): string {
    const msgs: Record<string, string> = {
      invalid:       'Code not found.',
      not_found:     'Code not found.',
      inactive:      'This code is not active.',
      expired:       'This code has expired.',
      not_started:   'This code is not valid yet.',
      limit_reached: 'This code has reached its usage limit.',
      min_purchase:  'Minimum purchase amount not reached.',
    };
    return msgs[key] ?? 'Invalid code.';
  }

  function toggleUpsell(id: string) {
    setSelectedUpsellIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const form = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '',
      phone: '', referralCode: '',
      isHotelGuest: false, cloudbedsRef: '',
    },
  });

  const watchGuest = form.watch('isHotelGuest');

  function handlePersonalSubmit(values: PersonalData) {
    setPersonalData(values);
    goToStep(4);
  }

  async function handleConfirm() {
    if (!personalData) return;
    setIsLoading(true);
    setBookingError(null);

    // ── DEMO MODE — bypass the API and jump to the confirmation screen ──────
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 600)); // short delay for realism
      setBookingRef(mockBookingReference());
      goToStep(5);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          upsellIds: Array.from(selectedUpsellIds),
          personalData: {
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            email: personalData.email,
            phone: personalData.phone,
            referralCode: personalData.referralCode,
            isHotelGuest: personalData.isHotelGuest,
            cloudbedsRef: personalData.cloudbedsRef,
          },
          packType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'no_spots_available') {
          setBookingError('no_spots');
        } else if (data.error === 'booking_too_late') {
          setBookingError('too_late');
        } else {
          setBookingError('generic');
        }
        return;
      }

      setBookingRef(data.bookingReference);
      goToStep(5);
    } catch {
      setBookingError('generic');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownloadICS() {
    downloadICS({
      uid: bookingRef,
      title: className,
      description: `Yoga class with ${instructor} at House of Shakti. Ref: ${bookingRef}`,
      location: `${location}, House of Shakti, Costa Rica`,
      startsAt: classDate,
      durationMinutes,
      organizerName: 'House of Shakti',
    }, `HOS-${className.toLowerCase().replace(/\s+/g, '-')}`);
  }

  function bookingErrorMsg(): string {
    if (bookingError === 'no_spots') return 'Sorry, this class is now fully booked.';
    if (bookingError === 'too_late') return 'Bookings close 1 hour before class.';
    return 'Something went wrong. Please try again.';
  }

  // ── Step transitions (direction-aware) ─────────────────────────────────────
  function goToStep(target: number) {
    setDirection(target > step ? 'forward' : 'backward');
    setStep(target);
  }
  function handleBack() {
    if (step > 1) goToStep(step - 1);
  }
  function handleContinue() {
    if (step === 1) goToStep(2);
    else if (step === 2) goToStep(3);
    else if (step === 3) form.handleSubmit(handlePersonalSubmit)();
    else if (step === 4) handleConfirm();
  }

  // Step 1 is the only step where Continue can be hard-disabled (no spots).
  // Validation on step 3 happens via form.handleSubmit and shows errors inline.
  const canContinue =
    step === 1 ? spotsRemaining > 0 :
    true;

  const stepVariants = useMemo(
    () => (direction === 'forward'
      ? { enter: { opacity: 0, x: 24 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } }
      : { enter: { opacity: 0, x: -24 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 24 } }
    ),
    [direction],
  );

  const isConfirmation = step === 5;
  const classImage = getClassPhoto(className);

  // Props bundle for BookingSummary (used in two places: desktop sidebar + mobile drawer).
  // The class image is intentionally NOT included — it lives only in Step 1's main content.
  const summaryProps = {
    className,
    instructor,
    classDate,
    durationMinutes,
    priceUsd,
    selectedUpsells: selectedUpsellsList,
    appliedCode,
    discountAmount,
    total,
    isFree,
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <BookingHeader
        step={step}
        totalSteps={4}
        isConfirmation={isConfirmation}
      />

      {/* Mobile drawer — only on actionable steps */}
      {!isConfirmation && (
        <BookingMobileSummary
          className={className}
          total={total}
          isFree={isTotalFree}
        >
          <BookingSummary {...summaryProps} bare />
        </BookingMobileSummary>
      )}

      {isConfirmation ? (
        <BookingConfirmation
          bookingRef={bookingRef}
          onDownloadICS={handleDownloadICS}
          className={className}
          instructor={instructor}
          classDate={classDate}
          durationMinutes={durationMinutes}
          location={location}
          priceUsd={priceUsd}
          isFree={isFree}
          selectedUpsells={selectedUpsellsList}
          appliedCode={appliedCode}
          discountAmount={discountAmount}
          total={total}
          email={personalData?.email}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1fr_38%] gap-12 lg:gap-16">
            {/* ── MAIN COLUMN ── */}
            <div>
              <div className="max-w-2xl">
                {/* Step eyebrow + heading */}
                <motion.div
                  key={`heading-${step}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink">
                    STEP 0{step}
                  </p>
                  <h1 className="font-display font-light text-ink text-3xl lg:text-4xl leading-tight mt-2">
                    {STEP_HEADINGS[step]}
                  </h1>
                </motion.div>

                {/* Step content */}
                <div className="mt-12 lg:mt-16">
                  <AnimatePresence mode="wait" custom={direction}>
                    {/* ── STEP 1: Class review ── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        {/* Image */}
                        <motion.div
                          initial={{ opacity: 0, scale: 1.04 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 1.4, ease: 'easeOut' }}
                          className="relative aspect-[16/9] overflow-hidden"
                        >
                          <img
                            src={classImage}
                            alt={className}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>

                        {/* Eyebrow row: category + duration */}
                        <div className="flex justify-between items-center mt-8">
                          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">
                            {getCategoryLabel(className)}
                          </span>
                          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-ink">
                            {durationMinutes} minutes
                          </span>
                        </div>

                        {/* Class title */}
                        <h2 className="font-display font-light text-ink text-3xl lg:text-4xl leading-tight mt-4">
                          {className}
                        </h2>

                        {/* Description (fallback if empty) */}
                        <p className="font-body text-base text-ink leading-relaxed mt-6">
                          {description?.trim() || 'A grounded practice paced to the rhythm of the body.'}
                        </p>

                        {/* Instructor row */}
                        <div className="mt-12 pt-8 border-t border-ink/10 flex items-center gap-4">
                          <div>
                            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">
                              Instructor
                            </p>
                            <p className="font-body text-sm text-ink mt-1">{instructor}</p>
                            <p className="font-body text-xs text-ink mt-1">
                              200hr Certified Teacher
                            </p>
                          </div>
                        </div>

                        {/* Schedule micro-grid */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
                          <ScheduleCell
                            label="Date"
                            value={format(classDate, 'EEE d MMM yyyy', { locale: enUS })}
                          />
                          <ScheduleCell
                            label="Time"
                            value={`${format(classDate, 'HH:mm')} — ${format(new Date(classDate.getTime() + durationMinutes * 60000), 'HH:mm')}`}
                          />
                          <ScheduleCell
                            label="Availability"
                            value={
                              spotsRemaining === 0
                                ? 'Fully booked'
                                : `${spotsRemaining} of ${capacity} spots`
                            }
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* ── STEP 2: Extras ── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        <p className="font-body text-sm text-ink max-w-md">
                          Optional additions to make your class more complete. Select any you&apos;d like.
                        </p>

                        {activeUpsells.length > 0 ? (
                          <div className="mt-12 space-y-4">
                            {activeUpsells.map((u) => {
                              const checked = selectedUpsellIds.has(u.id);
                              return (
                                <button
                                  key={u.id}
                                  type="button"
                                  onClick={() => toggleUpsell(u.id)}
                                  className={`
                                    group w-full text-left
                                    flex justify-between items-start gap-6 p-6
                                    border transition-all duration-300 ease-out cursor-pointer
                                    ${checked
                                      ? 'border-ink bg-cream/60'
                                      : 'border-ink/10 hover:border-ink/30 hover:bg-cream/30'}
                                  `}
                                  aria-pressed={checked}
                                >
                                  {/* LEFT */}
                                  <div className="flex-1 min-w-0">
                                    {u.priceUsd === 0 && (
                                      <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase text-burgundy border border-burgundy/30 px-2 py-[2px]">
                                        Included
                                      </span>
                                    )}
                                    <h3 className={`font-display font-light text-ink text-lg lg:text-xl leading-tight ${u.priceUsd === 0 ? 'mt-3' : ''}`}>
                                      {u.name}
                                    </h3>
                                    {u.description && (
                                      <p className="font-body text-sm text-ink leading-relaxed mt-2">
                                        {u.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* RIGHT: price + checkbox indicator */}
                                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                    <span className="font-display font-light text-ink text-xl lg:text-2xl">
                                      {u.priceUsd === 0 ? '—' : `+$${u.priceUsd}`}
                                    </span>
                                    <span
                                      aria-hidden
                                      className={`
                                        w-5 h-5 inline-flex items-center justify-center
                                        border transition-colors duration-300
                                        ${checked ? 'border-ink bg-ink' : 'border-ink/30'}
                                      `}
                                    >
                                      {checked && <Check className="w-3 h-3 text-cream" strokeWidth={2} />}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="font-body text-sm text-ink italic mt-12">
                            No add-ons available at this time.
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* ── STEP 3: Your details ── */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        <p className="font-body text-sm text-ink max-w-md">
                          We&apos;ll send your booking confirmation here.
                        </p>

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handlePersonalSubmit)} className="space-y-8 mt-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                              <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">First name</FormLabel>
                                  <FormControl><Input placeholder="Ana" className={editorialInput} {...field} /></FormControl>
                                  <FormMessage className="text-xs text-burgundy mt-1" />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">Last name</FormLabel>
                                  <FormControl><Input placeholder="García" className={editorialInput} {...field} /></FormControl>
                                  <FormMessage className="text-xs text-burgundy mt-1" />
                                </FormItem>
                              )} />
                            </div>

                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">Email</FormLabel>
                                <FormControl><Input type="email" placeholder="ana@email.com" className={editorialInput} {...field} /></FormControl>
                                <FormMessage className="text-xs text-burgundy mt-1" />
                              </FormItem>
                            )} />

                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">
                                  Phone <span className="font-normal normal-case tracking-normal">(optional)</span>
                                </FormLabel>
                                <FormControl><Input placeholder="+1 555-0100" className={editorialInput} {...field} /></FormControl>
                                <FormMessage className="text-xs text-burgundy mt-1" />
                              </FormItem>
                            )} />

                            {/* Referral code */}
                            <FormField control={form.control} name="referralCode" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-ink">
                                  <Tag className="w-3 h-3 text-ink" strokeWidth={1.5} />
                                  Referral code <span className="font-normal normal-case tracking-normal">(optional)</span>
                                </FormLabel>
                                <div className="flex items-end gap-3">
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. SURF-CAMP"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setCodeStatus('idle');
                                        setAppliedCode(null);
                                      }}
                                      className={`${editorialInput} uppercase tracking-[0.15em]`}
                                    />
                                  </FormControl>
                                  <button
                                    type="button"
                                    onClick={handleApplyCode}
                                    disabled={!field.value?.trim() || codeStatus === 'loading'}
                                    className="flex-shrink-0 font-body text-xs tracking-[0.25em] uppercase text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer pb-3"
                                  >
                                    {codeStatus === 'loading'
                                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
                                      : 'Apply'}
                                  </button>
                                </div>
                                <FormMessage className="text-xs text-burgundy mt-1" />
                                {codeStatus === 'success' && appliedCode && (
                                  <div className="flex items-start gap-2 mt-3 py-3 border-l-2 border-burgundy pl-3">
                                    <CheckCircle className="w-4 h-4 text-burgundy flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <div>
                                      <p className="font-body text-xs font-medium text-ink">
                                        {appliedCode.partnerName} — {
                                          appliedCode.benefitType === 'percentage'
                                            ? `${appliedCode.discountPercent}% off`
                                            : appliedCode.benefitType === 'fixed'
                                              ? `$${appliedCode.discountFixed} off`
                                              : 'Free gift included'
                                        }
                                      </p>
                                      <p className="font-body text-[11px] text-ink mt-0.5">{appliedCode.description}</p>
                                    </div>
                                  </div>
                                )}
                                {codeStatus === 'error' && (
                                  <div className="flex items-center gap-2 mt-3 py-2 border-l-2 border-burgundy pl-3">
                                    <XCircle className="w-4 h-4 text-burgundy flex-shrink-0" strokeWidth={1.5} />
                                    <p className="font-body text-xs text-burgundy">{codeErrorMsg(codeErrorKey)}</p>
                                  </div>
                                )}
                              </FormItem>
                            )} />

                            {/* Hotel guest — simple inline row, no card */}
                            <FormField control={form.control} name="isHotelGuest" render={({ field }) => (
                              <FormItem className="pt-4 border-t border-ink/10">
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="mt-1 cursor-pointer"
                                    />
                                  </FormControl>
                                  <div>
                                    <FormLabel className="font-body text-sm font-medium text-ink cursor-pointer">
                                      I&apos;m a guest at the hotel
                                    </FormLabel>
                                    <p className="font-body text-xs text-ink mt-1">
                                      Class is included in your stay.
                                    </p>
                                  </div>
                                </label>
                              </FormItem>
                            )} />

                            {watchGuest && (
                              <FormField control={form.control} name="cloudbedsRef" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">
                                    Cloudbeds reservation number <span className="font-normal normal-case tracking-normal">(optional)</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. CB-123456" className={editorialInput} {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs text-burgundy mt-1" />
                                </FormItem>
                              )} />
                            )}
                          </form>
                        </Form>
                      </motion.div>
                    )}

                    {/* ── STEP 4: Payment / Confirm ── */}
                    {step === 4 && personalData && (
                      <motion.div
                        key="step4"
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        <p className="font-body text-sm text-ink max-w-md">
                          Payment is collected at the studio. Choose how you&apos;d like to settle.
                        </p>

                        {/* Pack type selector — editorial flat cards, no radius */}
                        <div className="mt-12 border-y border-ink/10 divide-y divide-ink/10">
                          {PACKS.map((pack) => {
                            const active = packType === pack.id;
                            return (
                              <button
                                key={pack.id}
                                type="button"
                                onClick={() => setPackType(pack.id)}
                                className={`
                                  group relative w-full flex items-center justify-between
                                  py-5 pl-8 pr-2 text-left
                                  cursor-pointer transition-colors duration-300
                                  ${active ? '' : 'hover:bg-ink/[0.02]'}
                                `}
                              >
                                {/* Burgundy active marker on the left */}
                                <span
                                  aria-hidden
                                  className={`
                                    absolute left-0 top-1/2 -translate-y-1/2 h-10 w-[2px]
                                    transition-opacity duration-300
                                    ${active ? 'bg-burgundy opacity-100' : 'opacity-0'}
                                  `}
                                />
                                <div className="flex items-center gap-4">
                                  <div className={`
                                    w-4 h-4 rounded-full border flex-shrink-0
                                    flex items-center justify-center transition-colors duration-300
                                    ${active ? 'border-ink' : 'border-ink/40'}
                                  `}>
                                    {active && <div className="w-1.5 h-1.5 rounded-full bg-ink" />}
                                  </div>
                                  <div>
                                    <p className="font-body text-sm font-medium text-ink">
                                      {pack.name}
                                    </p>
                                    {pack.saving && (
                                      <p className="font-body text-xs text-burgundy mt-1">
                                        {pack.saving}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className="font-body text-sm text-ink">${pack.price} USD</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Cancellation note */}
                        <p className="font-body text-xs text-ink mt-6">
                          ✓ Free cancellation up to 2 hours before class.
                        </p>

                        {/* Error message */}
                        {bookingError && (
                          <div className="mt-4 flex items-start gap-2 py-3 border-l-2 border-burgundy pl-3">
                            <XCircle className="w-4 h-4 text-burgundy flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                            <p className="font-body text-xs text-burgundy">{bookingErrorMsg()}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <BookingNavigation
                  step={step}
                  isLoading={isLoading}
                  canContinue={canContinue}
                  onBack={handleBack}
                  onContinue={handleContinue}
                />
              </div>
            </div>

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="sticky top-24"
              >
                <BookingSummary {...summaryProps} />
              </motion.div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Schedule micro-grid cell used in Step 1 (label on top, value below) ─────
function ScheduleCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">{label}</p>
      <p className="font-body text-sm text-ink mt-1">{value}</p>
    </div>
  );
}
