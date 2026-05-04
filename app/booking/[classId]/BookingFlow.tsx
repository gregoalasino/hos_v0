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
  CreditCard, Calendar,
} from 'lucide-react';
import { MOCK_UPSELLS } from '@/lib/mock-data';
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

function generateRef(): string {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HOS-${date}-${random}`;
}

export default function BookingFlow({
  classId, className, instructor, startsAt,
  durationMinutes, capacity, spotsRemaining,
  priceUsd, location, description, color,
}: Props) {
  const { lang, toggleLang } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<Set<string>>(new Set());
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'room'>('card');
  const [bookingRef, setBookingRef] = useState('');

  const classDate = new Date(startsAt);
  const isFree = priceUsd === 0;
  const activeUpsells = MOCK_UPSELLS.filter(u => u.isActive);

  // Selected upsells with full data
  const selectedUpsellsList = useMemo(
    () => activeUpsells.filter(u => selectedUpsellIds.has(u.id)),
    [selectedUpsellIds]
  );

  const subtotalUpsells = selectedUpsellsList.reduce((acc, u) => acc + u.priceUsd, 0);
  const total = priceUsd + subtotalUpsells;
  const isTotalFree = total === 0;

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

  function handleConfirm() {
    // STRIPE: For paid classes with 'card' payment, redirect to Stripe Checkout here.
    // paymentMethod === 'room' sets paymentStatus to 'pending' (charged at hotel checkout).
    const ref = generateRef();
    setBookingRef(ref);
    setStep(5);
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
        {/* Step indicator — steps 1–4 only; step 5 is the confirmation screen */}
        {step < 5 && (
          <div className="mb-8">
            <BookingStep current={step} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Class details ── */}
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              {/* Hero image with class name overlay */}
              <div
                className="relative h-48 rounded-2xl overflow-hidden mb-5"
                style={{ background: color ? `${color}22` : '#F2EBDA' }}
              >
                <img
                  src="/images/yoga-hero.jpeg"
                  alt={className}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/65 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 mb-1">
                    {color && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                    <span className="text-xs text-cream/80 uppercase tracking-widest">{instructor}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-cream font-light">{className}</h2>
                </div>
              </div>

              {/* Class info */}
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

              {/* Instructor card */}
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

              {/* Description */}
              {description && (
                <p className="text-dark/60 text-sm leading-relaxed mb-5">{description}</p>
              )}

              {/* Price — large, prominent */}
              <div className="text-center py-5 mb-5 border-y border-dark/8">
                {isFree ? (
                  <p className="font-serif text-3xl font-light" style={{ color: '#4a7c59' }}>{tr(lang, 'Gratis', 'Free')}</p>
                ) : (
                  <>
                    <p className="font-serif text-3xl font-light text-dark">${priceUsd}</p>
                    <p className="text-xs text-dark/40 font-sans mt-1">{tr(lang, 'por persona', 'per person')}</p>
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
              <h2 className="font-serif text-2xl font-light text-dark mb-1">{tr(lang, 'Extras', 'Add extras')}</h2>
              <p className="text-sm text-dark/50 mb-6">{tr(lang, 'Opcional — mejora tu experiencia en clase.', 'Optional — enhance your class experience.')}</p>

              {activeUpsells.length > 0 ? (
                <div className="bg-cream rounded-2xl divide-y divide-dark/5 mb-5 overflow-hidden">
                  {activeUpsells.map((u) => {
                    const checked = selectedUpsellIds.has(u.id);
                    return (
                      <label
                        key={u.id}
                        className="flex items-start gap-4 p-4 cursor-pointer hover:bg-dark/2 transition-colors"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleUpsell(u.id)}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark">{u.name}</p>
                          <p className="text-xs text-dark/50 mt-0.5 leading-relaxed">{u.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-dark flex-shrink-0">+${u.priceUsd}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-dark/40 italic mb-5">{tr(lang, 'No hay extras disponibles por ahora.', 'No add-ons available at this time.')}</p>
              )}

              {/* Live total */}
              <div className="border border-dark/10 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm text-dark/70">
                  <span>{tr(lang, 'Clase', 'Class')}</span>
                  <span>{isFree ? tr(lang, 'Gratis', 'Free') : `$${priceUsd}`}</span>
                </div>
                {selectedUpsellsList.map(u => (
                  <div key={u.id} className="flex justify-between text-sm text-dark/70">
                    <span>{u.name}</span>
                    <span>+${u.priceUsd}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-dark pt-2 border-t border-dark/10">
                  <span>Total</span>
                  <span className={isTotalFree ? 'text-emerald-600' : ''}>
                    {isTotalFree ? tr(lang, 'Gratis', 'Free') : `$${total} USD`}
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

                  {/* Referral code — free text, no validation, no API call */}
                  {/* TODO: referralCode will be visible in admin /reservas as a filterable column (next sprint) */}
                  <FormField control={form.control} name="referralCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tr(lang, 'Código de referido', 'Referral code')}{' '}
                        <span className="text-dark/40 font-normal">({tr(lang, 'opcional', 'optional')})</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={tr(lang, 'ej. SURF-CAMP, HOTEL-PARTNER...', 'e.g. SURF-CAMP, HOTEL-PARTNER...')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Hotel guest banner */}
                  <FormField control={form.control} name="isHotelGuest" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3 bg-cream rounded-xl p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="text-sm font-medium text-dark cursor-pointer">
                            {tr(lang, 'Soy huésped del hotel', 'I\'m a hotel guest')}
                          </FormLabel>
                          <p className="text-xs text-dark/50 mt-0.5">
                            {isFree
                              ? tr(lang, 'Las clases gratuitas son exclusivas para huéspedes.', 'Free classes are exclusive to hotel guests.')
                              : tr(lang, 'Los huéspedes pueden acceder a tarifas especiales.', 'Hotel guests may access special rates.')}
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

          {/* ── STEP 4: Confirm & pay ── */}
          {step === 4 && personalData && (
            <motion.div key="step4" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <h2 className="font-serif text-2xl font-light text-dark mb-1">{tr(lang, 'Confirmar y pagar', 'Confirm & pay')}</h2>
              <p className="text-sm text-dark/50 mb-6">{tr(lang, 'Revisá tu reserva antes de confirmar.', 'Review your booking before confirming.')}</p>

              {/* Booking summary table */}
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
                  <div className="flex justify-between pt-2 border-t border-dark/10 font-semibold text-sm">
                    <span className="text-dark">Total</span>
                    <span className={isTotalFree ? 'text-emerald-600' : 'text-dark'}>
                      {isTotalFree ? tr(lang, 'Gratis', 'Free') : `$${total} USD`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment method selector */}
              {!isTotalFree && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-3">{tr(lang, 'Método de pago', 'Payment method')}</p>
                  <div className="space-y-2">
                    {([
                      {
                        id: 'card' as const,
                        label: tr(lang, 'Tarjeta de crédito / débito', 'Credit / debit card'),
                        sub: tr(lang, 'Procesado de forma segura por Stripe', 'Processed securely by Stripe'),
                      },
                      {
                        id: 'room' as const,
                        label: tr(lang, 'Cargar a la habitación', 'Charge to hotel room'),
                        sub: tr(lang, 'Se cobra al hacer checkout', 'Billed at checkout'),
                      },
                    ] as const).map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors ${
                          paymentMethod === opt.id
                            ? 'border-dark bg-dark/5'
                            : 'border-dark/15 bg-cream hover:border-dark/30'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          paymentMethod === opt.id ? 'border-dark' : 'border-dark/30'
                        }`}>
                          {paymentMethod === opt.id && (
                            <div className="w-2 h-2 rounded-full bg-dark" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark">{opt.label}</p>
                          <p className="text-xs text-dark/50 mt-0.5">{opt.sub}</p>
                        </div>
                        {opt.id === 'card' && (
                          <CreditCard className="w-4 h-4 text-dark/30 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Free booking notice */}
              {isTotalFree && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">{tr(lang, 'Reserva gratuita', 'Free booking')}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{tr(lang, 'No se requiere pago.', 'No payment required.')}</p>
                  </div>
                </div>
              )}

              {/* Free cancellation note */}
              <p className="text-xs text-dark/40 text-center mb-5">
                ✓ {tr(lang, 'Cancelación gratuita hasta 24 horas antes de la clase.', 'Free cancellation up to 24 hours before the class.')}
              </p>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-11">
                  <ArrowLeft className="w-4 h-4 mr-2" /> {tr(lang, 'Atrás', 'Back')}
                </Button>
                <Button onClick={handleConfirm} className="flex-1 bg-dark hover:bg-burgundy text-cream h-11">
                  {isTotalFree
                    ? tr(lang, 'Confirmar reserva', 'Confirm booking')
                    : `${tr(lang, 'Confirmar y pagar', 'Confirm & pay')} · $${total} USD`}
                  {!isTotalFree && <CreditCard className="w-4 h-4 ml-2" />}
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
              {/* Animated check circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-10 h-10 text-emerald-600" />
              </motion.div>

              <h2 className="font-serif text-3xl font-light text-dark mb-1">{tr(lang, '¡Reserva confirmada!', 'Booking confirmed!')}</h2>
              <p className="text-dark/50 text-sm mb-7">
                {tr(lang, 'Te esperamos en el mat. Revisá tu email para la confirmación y el recordatorio.', 'See you on the mat. Check your email for a confirmation and 1h reminder.')}
              </p>

              {/* Reference code badge */}
              <div className="inline-block mb-6 bg-cream px-5 py-2 rounded-full border border-dark/10">
                <p className="font-mono text-base font-bold text-dark tracking-wider">{bookingRef}</p>
              </div>

              {/* Confirmation card */}
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
                  {/* Referral code — show only if provided */}
                  {personalData?.referralCode && (
                    <ConfirmRow
                      label={tr(lang, 'Código de referido', 'Referred by')}
                      value={personalData.referralCode}
                      highlight
                    />
                  )}
                  <div className="flex justify-between pt-2 border-t border-dark/10 font-semibold text-sm">
                    <span className="text-dark">{tr(lang, 'Total pagado', 'Total paid')}</span>
                    <span className={isTotalFree ? 'text-emerald-600' : 'text-dark'}>
                      {isTotalFree ? tr(lang, 'Gratis', 'Free') : `$${total} USD`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleDownloadICS}
                  variant="outline"
                  className="w-full h-11 gap-2"
                >
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
