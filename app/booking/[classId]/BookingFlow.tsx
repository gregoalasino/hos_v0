'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es as esLocale } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Clock, MapPin, Users, Check,
  Calendar, Tag, CheckCircle, XCircle, Loader2,
} from 'lucide-react';
import type { Upsell, ReferralCode } from '@/types';
import { downloadICS } from '@/lib/ics';
import BookingStep from '@/components/booking/BookingStep';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';

// ── Class photo mapping ────────────────────────────────────────────────────────
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

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

type PackType = 'dropin' | 'pack5' | 'pack10';

const PACKS: { id: PackType; name: string; nameEs: string; classes: number; price: number; saving?: number; savingEs?: string; savingEn?: string }[] = [
  { id: 'dropin', name: 'Drop-in', nameEs: 'Drop-in', classes: 1, price: 20 },
  { id: 'pack5', name: 'Pack x5', nameEs: 'Pack x5', classes: 5, price: 75, savingEs: 'Ahorrás $25', savingEn: 'Save $25' },
  { id: 'pack10', name: 'Pack x10', nameEs: 'Pack x10', classes: 10, price: 130, savingEs: 'Ahorrás $70', savingEn: 'Save $70' },
];

type BookingError = 'no_spots' | 'too_late' | 'generic' | null;

async function validateReferralCodeFromDB(
  code: string,
  subtotal: number,
): Promise<{ valid: boolean; code?: ReferralCode; error?: string }> {
  try {
    const res = await fetch('/api/referral-codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    const data = await res.json();
    if (!data.valid) return { valid: false, error: data.error };

    // Map API response to ReferralCode type
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

export default function BookingFlow({
  classId, className, instructor, startsAt,
  durationMinutes, capacity, spotsRemaining,
  priceUsd, location, description, color, upsells,
}: Props) {
  const { lang, toggleLang } = useLanguage();
  const [step, setStep] = useState(1);
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
    const result = await validateReferralCodeFromDB(codeStr, subtotal);
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
    const msgs: Record<string, [string, string]> = {
      invalid:       ['Código no encontrado.', 'Code not found.'],
      not_found:     ['Código no encontrado.', 'Code not found.'],
      inactive:      ['Este código no está activo.', 'This code is not active.'],
      expired:       ['Este código ya venció.', 'This code has expired.'],
      not_started:   ['Este código aún no está vigente.', 'This code is not valid yet.'],
      limit_reached: ['Este código alcanzó su límite de usos.', 'This code has reached its usage limit.'],
      min_purchase:  ['Compra mínima no alcanzada.', 'Minimum purchase amount not reached.'],
    };
    return tr(lang, msgs[key]?.[0] ?? 'Código inválido.', msgs[key]?.[1] ?? 'Invalid code.');
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
    setStep(4);
  }

  async function handleConfirm() {
    if (!personalData) return;
    setIsLoading(true);
    setBookingError(null);
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
      setStep(5);
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
      description: tr(lang,
        `Clase de yoga con ${instructor} en House of Shakti. Ref: ${bookingRef}`,
        `Yoga class with ${instructor} at House of Shakti. Ref: ${bookingRef}`
      ),
      location: `${location}, House of Shakti, Costa Rica`,
      startsAt: classDate,
      durationMinutes,
      organizerName: 'House of Shakti',
    }, `HOS-${className.toLowerCase().replace(/\s+/g, '-')}`);
  }

  function bookingErrorMsg(): string {
    if (bookingError === 'no_spots') return tr(lang, 'Lo sentimos, la clase ya no tiene lugares disponibles.', 'Sorry, this class is now fully booked.');
    if (bookingError === 'too_late') return tr(lang, 'Las reservas cierran 1 hora antes de la clase.', 'Bookings close 1 hour before class.');
    return tr(lang, 'Ocurrió un error. Por favor intentá de nuevo.', 'Something went wrong. Please try again.');
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-dark text-cream px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/yoga" className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            {tr(lang, 'Clases', 'Classes')}
          </Link>
          <span className="font-serif text-base font-light">House of Shakti</span>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-cream/20 hover:border-cream/40 transition-colors text-cream/60"
          >
            <span style={{ opacity: lang === 'es' ? 1 : 0.4 }}>ES</span>
            <span className="opacity-30">·</span>
            <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {step < 5 && (
          <div className="mb-8">
            <BookingStep current={step} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Class details ── */}
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div
                className="relative h-56 rounded-2xl overflow-hidden mb-5"
                style={{ background: color ? `${color}22` : '#F2EBDA' }}
              >
                <img src={getClassPhoto(className)} alt={className} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/65 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 mb-1">
                    {color && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                    <span className="text-xs text-cream/80 uppercase tracking-widest">{instructor}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-cream font-light">{className}</h2>
                </div>
              </div>

              <div className="bg-cream rounded-2xl p-4 mb-5 space-y-2">
                <div className="flex items-center gap-2 text-sm text-dark/70">
                  <Clock className="w-4 h-4 text-burgundy flex-shrink-0" />
                  <span>
                    {lang === 'es'
                      ? format(classDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: esLocale })
                      : format(classDate, 'EEEE, MMMM d, yyyy')
                    } · {format(classDate, 'h:mm a')} ({durationMinutes} min)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark/70">
                  <MapPin className="w-4 h-4 text-burgundy flex-shrink-0" />
                  {location}
                </div>
                <div className="flex items-center gap-2 text-sm text-dark/70">
                  <Users className="w-4 h-4 text-burgundy flex-shrink-0" />
                  {spotsRemaining} {tr(lang, `de ${capacity} lugares disponibles`, `of ${capacity} spots remaining`)}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-cream rounded-2xl p-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-dark/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-sm font-semibold text-dark">
                    {instructor.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">{instructor}</p>
                  <p className="text-xs text-dark/50">{tr(lang, 'Profesora certificada 200hr', '200hr Certified Teacher')}</p>
                </div>
              </div>

              {description && (
                <p className="text-dark/60 text-sm leading-relaxed mb-5">{description}</p>
              )}

              <div className="text-center py-5 mb-5 border-y border-dark/8">
                {isFree ? (
                  <p className="font-serif text-3xl font-light" style={{ color: '#4a7c59' }}>{tr(lang, 'Gratis', 'Free')}</p>
                ) : (
                  <>
                    <p className="font-serif text-3xl font-light text-dark">${priceUsd}</p>
                    <p className="text-xs text-dark/40 font-sans mt-1">{tr(lang, 'por persona · pago en el estudio', 'per person · pay at studio')}</p>
                  </>
                )}
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-dark hover:bg-burgundy text-cream h-12 text-base"
                disabled={spotsRemaining === 0}
              >
                {tr(lang, 'Reservar esta clase', 'Book this class')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* ── STEP 2: Add-ons ── */}
          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <ClassReminder className={className} instructor={instructor} color={color} classDate={classDate} lang={lang} />
              <h2 className="font-serif text-2xl font-light text-dark mb-1">{tr(lang, 'Extras', 'Add extras')}</h2>
              <p className="text-sm text-dark/50 mb-6">{tr(lang, 'Opcional — mejora tu experiencia en clase.', 'Optional — enhance your class experience.')}</p>

              {activeUpsells.length > 0 ? (
                <div className="bg-cream rounded-2xl divide-y divide-dark/5 mb-5 overflow-hidden">
                  {activeUpsells.map((u) => {
                    const checked = selectedUpsellIds.has(u.id);
                    return (
                      <label key={u.id} className="flex items-start gap-4 p-4 cursor-pointer hover:bg-dark/2 transition-colors">
                        <Checkbox checked={checked} onCheckedChange={() => toggleUpsell(u.id)} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark">{u.name}</p>
                          <p className="text-xs text-dark/50 mt-0.5 leading-relaxed">{u.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-dark flex-shrink-0">
                          {u.priceUsd === 0 ? tr(lang, 'Incluido', 'Included') : `+$${u.priceUsd}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-dark/40 italic mb-5">{tr(lang, 'No hay extras disponibles por ahora.', 'No add-ons available at this time.')}</p>
              )}

              <div className="border border-dark/10 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm text-dark/70">
                  <span>{tr(lang, 'Clase', 'Class')}</span>
                  <span>{isFree ? tr(lang, 'Gratis', 'Free') : `$${priceUsd}`}</span>
                </div>
                {selectedUpsellsList.map(u => (
                  <div key={u.id} className="flex justify-between text-sm text-dark/70">
                    <span>{u.name}</span>
                    <span>{u.priceUsd === 0 ? tr(lang, '+Incluido', '+Included') : `+$${u.priceUsd}`}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-dark pt-2 border-t border-dark/10">
                  <span>Subtotal</span>
                  <span className={subtotal === 0 ? 'text-emerald-600' : ''}>
                    {subtotal === 0 ? tr(lang, 'Gratis', 'Free') : `$${subtotal} USD`}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">
                  <ArrowLeft className="w-4 h-4 mr-2" /> {tr(lang, 'Atrás', 'Back')}
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-dark hover:bg-burgundy text-cream h-11">
                  {tr(lang, 'Continuar', 'Continue')} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Your details ── */}
          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <ClassReminder className={className} instructor={instructor} color={color} classDate={classDate} lang={lang} />
              <h2 className="font-serif text-2xl font-light text-dark mb-1">{tr(lang, 'Tus datos', 'Your details')}</h2>
              <p className="text-sm text-dark/50 mb-6">{tr(lang, 'Los usaremos para confirmar tu reserva.', 'We\'ll use this to confirm your booking.')}</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePersonalSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tr(lang, 'Nombre', 'First name')}</FormLabel>
                        <FormControl><Input placeholder="Ana" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tr(lang, 'Apellido', 'Last name')}</FormLabel>
                        <FormControl><Input placeholder="García" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="ana@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tr(lang, 'Teléfono', 'Phone')}{' '}
                        <span className="text-dark/40 font-normal">({tr(lang, 'opcional', 'optional')})</span>
                      </FormLabel>
                      <FormControl><Input placeholder="+1 555-0100" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Referral code */}
                  <FormField control={form.control} name="referralCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-dark/50" />
                        {tr(lang, 'Código de referido', 'Referral code')}{' '}
                        <span className="text-dark/40 font-normal">({tr(lang, 'opcional', 'optional')})</span>
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder={tr(lang, 'ej. SURF-CAMP', 'e.g. SURF-CAMP')}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setCodeStatus('idle');
                              setAppliedCode(null);
                            }}
                            className="uppercase font-mono"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyCode}
                          disabled={!field.value?.trim() || codeStatus === 'loading'}
                          className="flex-shrink-0 px-4"
                        >
                          {codeStatus === 'loading'
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : tr(lang, 'Aplicar', 'Apply')}
                        </Button>
                      </div>
                      <FormMessage />
                      {codeStatus === 'success' && appliedCode && (
                        <div className="flex items-start gap-2 mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-emerald-800">
                              {appliedCode.partnerName} — {
                                appliedCode.benefitType === 'percentage'
                                  ? `${appliedCode.discountPercent}% ${tr(lang, 'de descuento', 'off')}`
                                  : appliedCode.benefitType === 'fixed'
                                    ? `$${appliedCode.discountFixed} ${tr(lang, 'de descuento', 'off')}`
                                    : `${tr(lang, 'Regalo incluido', 'Free gift included')}`
                              }
                            </p>
                            <p className="text-[11px] text-emerald-600 mt-0.5">{appliedCode.description}</p>
                          </div>
                        </div>
                      )}
                      {codeStatus === 'error' && (
                        <div className="flex items-center gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <p className="text-xs text-red-700">{codeErrorMsg(codeErrorKey)}</p>
                        </div>
                      )}
                    </FormItem>
                  )} />

                  {/* Hotel guest */}
                  <FormField control={form.control} name="isHotelGuest" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3 bg-cream rounded-xl p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                        </FormControl>
                        <div>
                          <FormLabel className="text-sm font-medium text-dark cursor-pointer">
                            {tr(lang, 'Soy huésped del hotel', 'I\'m a hotel guest')}
                          </FormLabel>
                          <p className="text-xs text-dark/50 mt-0.5">
                            {tr(lang, 'Los huéspedes pueden acceder a tarifas especiales.', 'Hotel guests may access special rates.')}
                          </p>
                        </div>
                      </div>
                    </FormItem>
                  )} />

                  {watchGuest && (
                    <FormField control={form.control} name="cloudbedsRef" render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {tr(lang, 'Número de reserva Cloudbeds', 'Cloudbeds reservation number')}{' '}
                          <span className="text-dark/40 font-normal">({tr(lang, 'opcional', 'optional')})</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CB-123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">
                      <ArrowLeft className="w-4 h-4 mr-2" /> {tr(lang, 'Atrás', 'Back')}
                    </Button>
                    <Button type="submit" className="flex-1 bg-dark hover:bg-burgundy text-cream h-11">
                      {tr(lang, 'Continuar', 'Continue')} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {/* ── STEP 4: Confirm ── */}
          {step === 4 && personalData && (
            <motion.div key="step4" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <ClassReminder className={className} instructor={instructor} color={color} classDate={classDate} lang={lang} />
              <h2 className="font-serif text-2xl font-light text-dark mb-1">{tr(lang, 'Confirmar reserva', 'Confirm booking')}</h2>
              <p className="text-sm text-dark/50 mb-6">{tr(lang, 'Revisá tu reserva antes de confirmar.', 'Review your booking before confirming.')}</p>

              {/* Booking summary */}
              <div className="bg-cream rounded-2xl p-4 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-3">{tr(lang, 'Resumen de reserva', 'Booking summary')}</p>
                <div className="space-y-1.5">
                  <SummaryRow label={tr(lang, 'Clase', 'Class')} value={className} />
                  <SummaryRow
                    label={tr(lang, 'Fecha', 'Date')}
                    value={lang === 'es'
                      ? `${format(classDate, "EEEE d 'de' MMMM", { locale: esLocale })} · ${format(classDate, 'h:mm a')}`
                      : `${format(classDate, 'EEEE, MMMM d')} · ${format(classDate, 'h:mm a')}`}
                  />
                  <SummaryRow label={tr(lang, 'Instructor', 'Instructor')} value={instructor} />
                  {selectedUpsellsList.length > 0 && (
                    <SummaryRow
                      label={tr(lang, 'Extras', 'Extras')}
                      value={selectedUpsellsList.map(u => u.name).join(', ')}
                    />
                  )}
                  {appliedCode && discountAmount > 0 && (
                    <>
                      <div className="flex justify-between text-sm py-1 border-b border-dark/5">
                        <span className="text-dark/50">{tr(lang, 'Subtotal', 'Subtotal')}</span>
                        <span className="text-dark">${subtotal} USD</span>
                      </div>
                      <div className="flex justify-between text-sm py-1 border-b border-dark/5">
                        <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          {appliedCode.code}
                        </span>
                        <span className="text-emerald-700 font-medium">-${discountAmount} USD</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t border-dark/10 font-semibold text-sm">
                    <span className="text-dark">Total</span>
                    <span className={isTotalFree ? 'text-emerald-600' : 'text-dark'}>
                      {isTotalFree ? tr(lang, 'Gratis', 'Free') : `$${total} USD`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pack type selector */}
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-3">
                  {tr(lang, '¿Cómo vas a pagar?', 'How will you pay?')}
                </p>
                <div className="space-y-2">
                  {PACKS.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setPackType(pack.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                        packType === pack.id
                          ? 'border-dark bg-dark/5'
                          : 'border-dark/15 bg-cream hover:border-dark/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          packType === pack.id ? 'border-dark' : 'border-dark/30'
                        }`}>
                          {packType === pack.id && (
                            <div className="w-2 h-2 rounded-full bg-dark" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark">{lang === 'es' ? pack.nameEs : pack.name}</p>
                          {(pack.savingEs || pack.savingEn) && (
                            <p className="text-xs text-emerald-600">{lang === 'es' ? pack.savingEs : pack.savingEn}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-dark">${pack.price} USD</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-dark/40 mt-3 text-center">
                  {tr(lang, 'El pago se realiza en el estudio.', 'Payment is collected at the studio.')}
                </p>
              </div>

              {/* Cancellation note */}
              <p className="text-xs text-dark/40 text-center mb-5">
                ✓ {tr(lang, 'Cancelación gratuita hasta 2 horas antes de la clase.', 'Free cancellation up to 2 hours before class.')}
              </p>

              {/* Error message */}
              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-700">{bookingErrorMsg()}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-11" disabled={isLoading}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> {tr(lang, 'Atrás', 'Back')}
                </Button>
                <Button onClick={handleConfirm} disabled={isLoading} className="flex-1 bg-dark hover:bg-burgundy text-cream h-11">
                  {isLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : tr(lang, 'Confirmar reserva', 'Confirm booking')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 5: Confirmed ── */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-10 h-10 text-emerald-600" />
              </motion.div>

              <h2 className="font-serif text-3xl font-light text-dark mb-2">{tr(lang, '¡Reserva confirmada!', 'Booking confirmed!')}</h2>
              <p className="text-dark/50 text-sm mb-3">
                {tr(lang, 'Tu lugar está reservado. Presentate 10 minutos antes de la clase.', 'Your spot is reserved. Please arrive 10 minutes before class.')}
              </p>
              <p className="text-dark/40 text-xs mb-7">
                {tr(lang, 'El pago se realiza en el estudio.', 'Payment is collected at the studio.')}
              </p>

              <div className="inline-block mb-6 bg-cream px-5 py-2 rounded-full border border-dark/10">
                <p className="font-mono text-base font-bold text-dark tracking-wider">{bookingRef}</p>
              </div>

              <div className="bg-cream rounded-2xl p-5 mb-6 text-left">
                <div className="space-y-0">
                  <ConfirmRow label={tr(lang, 'Clase', 'Class')} value={className} />
                  <ConfirmRow label={tr(lang, 'Instructor', 'Instructor')} value={instructor} />
                  <ConfirmRow
                    label={tr(lang, 'Fecha', 'Date')}
                    value={lang === 'es'
                      ? format(classDate, "d 'de' MMMM 'de' yyyy · h:mm a", { locale: esLocale })
                      : format(classDate, "MMMM d, yyyy · h:mm a")}
                  />
                  <ConfirmRow label={tr(lang, 'Lugar', 'Location')} value={location} />
                  {selectedUpsellsList.length > 0 && (
                    <ConfirmRow
                      label={tr(lang, 'Extras', 'Extras')}
                      value={selectedUpsellsList.map(u => u.name).join(', ')}
                    />
                  )}
                  {personalData && (
                    <ConfirmRow label={tr(lang, 'Nombre', 'Name')} value={`${personalData.firstName} ${personalData.lastName}`} />
                  )}
                  {appliedCode && discountAmount > 0 && (
                    <>
                      <ConfirmRow label={tr(lang, 'Subtotal', 'Subtotal')} value={`$${subtotal} USD`} />
                      <ConfirmRow
                        label={`${tr(lang, 'Código', 'Code')} ${appliedCode.code}`}
                        value={`-$${discountAmount} USD`}
                        highlight
                      />
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t border-dark/10 font-semibold text-sm">
                    <span className="text-dark">Total</span>
                    <span className={isTotalFree ? 'text-emerald-600' : 'text-dark'}>
                      {isTotalFree ? tr(lang, 'Gratis', 'Free') : `$${total} USD`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleDownloadICS} variant="outline" className="w-full h-11 gap-2">
                  <Calendar className="w-4 h-4" />
                  {tr(lang, 'Agregar al calendario (.ics)', 'Add to calendar (.ics)')}
                </Button>
                <Link href="/yoga" className="block">
                  <Button variant="outline" className="w-full h-11">
                    {tr(lang, 'Ver más clases', 'See more classes')}
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-dark/40 mt-5">
                📧 {tr(lang, 'Confirmación enviada a', 'Confirmation sent to')} {personalData?.email}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Mini class reminder shown at the top of steps 2-4 ──────────────────────
function ClassReminder({
  className, instructor, color, classDate, lang,
}: {
  className: string; instructor: string; color?: string;
  classDate: Date; lang: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-cream rounded-2xl p-3 mb-6 overflow-hidden">
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
        <img src={getClassPhoto(className)} alt={className} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-0.5">{instructor}</p>
        <p className="font-serif text-sm font-light text-dark truncate">{className}</p>
        <p className="text-[11px] text-dark/50 mt-0.5">
          {format(classDate, lang === 'es' ? "EEE d MMM · h:mm a" : "EEE MMM d · h:mm a")}
        </p>
      </div>
      {color && (
        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: color }} />
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1 border-b border-dark/5 last:border-0">
      <span className="text-dark/50 flex-shrink-0">{label}</span>
      <span className="text-dark text-right">{value}</span>
    </div>
  );
}

function ConfirmRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1 border-b border-dark/5 last:border-0">
      <span className="text-dark/50 flex-shrink-0">{label}</span>
      <span
        className="text-right"
        style={{ color: highlight ? '#c4a030' : '#340000', fontWeight: highlight ? 600 : 400 }}
      >
        {value}
      </span>
    </div>
  );
}
