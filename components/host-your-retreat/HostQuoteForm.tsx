'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Flower2,
  Waves,
  GraduationCap,
  Wind,
  Music,
  Droplets,
  Spool,
  MoonStar,
  Palette,
  Ellipsis,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { tr, type Lang } from '@/lib/i18n';
import { whatsappUrl } from '@/lib/whatsapp';

// ─── Request a quote ─────────────────────────────────────────────────────────
// The page's ask. A retreat is priced on three things — what it is, when it
// is, and how many are coming — so those are the three questions, and nothing
// else: name, email and a message box would only be the WhatsApp conversation
// written out in advance. The answers compose the opening line of that
// conversation as they are given, in whichever language the reader is
// reading, and the button hands it to WhatsApp already written. The
// composed message is shown underneath, so nobody is sent off the site with
// a payload they haven't read.
//
// The house's general number, via lib/whatsapp — the same door the floating
// button's "Host Your Retreat" entry opens.

type Kind = {
  id: string;
  icon: LucideIcon;
  label: (lang: Lang) => string;
};

// What a retreat can be. The first six are the owners' list; the rest are the
// kinds of gathering that actually come to Santa Teresa, so a host finds
// their own without reaching for "Other". Each carries a thin lucide mark —
// the same family the rest of the site's controls draw from.
const KINDS: Kind[] = [
  { id: 'yoga', icon: Flower2, label: () => 'Yoga' },
  { id: 'surf-yoga', icon: Waves, label: (l) => tr(l, 'Surf y yoga', 'Surf & yoga') },
  {
    id: 'teacher-training',
    icon: GraduationCap,
    label: (l) => tr(l, 'Formación de profesores', 'Teacher training'),
  },
  {
    id: 'breathwork',
    icon: Wind,
    label: (l) => tr(l, 'Respiración y meditación', 'Breathwork & meditation'),
  },
  { id: 'sound-healing', icon: Music, label: (l) => tr(l, 'Sanación con sonido', 'Sound healing') },
  { id: 'aguahara', icon: Droplets, label: () => 'Aguahara' },
  { id: 'macrame', icon: Spool, label: () => 'Macramé' },
  { id: 'tarot', icon: MoonStar, label: () => 'Tarot' },
  { id: 'creative', icon: Palette, label: (l) => tr(l, 'Artes creativas', 'Creative arts') },
  { id: 'other', icon: Ellipsis, label: (l) => tr(l, 'Otro', 'Other') },
];

type Answers = {
  kind: string | null;
  /** Free text, offered when "Other" is chosen. */
  other: string;
  from: string;
  to: string;
  min: string;
  max: string;
};

const EMPTY: Answers = { kind: null, other: '', from: '', to: '', min: '', max: '' };

// Inputs follow the booking flow's rule — a hairline underneath and nothing
// else, editorial rather than boxy. Number fields drop the browser's spinner
// for the same reason.
const FIELD =
  'w-full bg-transparent border-0 border-b border-ink/25 px-0 py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none transition-colors duration-300 [color-scheme:light]';
const NUMBER = `${FIELD} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;
const LABEL = 'block font-body text-[10px] tracking-[0.25em] uppercase text-ink/70';

// A date input hands back YYYY-MM-DD. Read as a local date, never through
// Date.parse — that treats the string as UTC midnight, which west of
// Greenwich is the evening before.
function formatDate(iso: string, lang: Lang): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function count(value: string): number | null {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function composeMessage(lang: Lang, a: Answers): string {
  const lines: string[] = [];

  const kind = KINDS.find((k) => k.id === a.kind);
  if (kind) {
    const detail = a.other.trim();
    const what = kind.id === 'other' && detail ? detail : kind.label(lang);
    lines.push(tr(lang, `• Retiro: ${what}`, `• Retreat: ${what}`));
  }

  const from = formatDate(a.from, lang);
  const to = formatDate(a.to, lang);
  if (from && to) {
    lines.push(tr(lang, `• Fechas: del ${from} al ${to}`, `• Dates: ${from} – ${to}`));
  } else if (from) {
    lines.push(tr(lang, `• Fechas: desde el ${from}`, `• Dates: from ${from}`));
  } else if (to) {
    lines.push(tr(lang, `• Fechas: hasta el ${to}`, `• Dates: until ${to}`));
  }

  const min = count(a.min);
  const max = count(a.max);
  if (min && max) {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    lines.push(
      lo === hi
        ? tr(lang, `• Cantidad de personas: ${lo}`, `• Group size: ${lo} people`)
        : tr(lang, `• Cantidad de personas: entre ${lo} y ${hi}`, `• Group size: ${lo}–${hi} people`),
    );
  } else if (min) {
    lines.push(
      tr(lang, `• Cantidad de personas: alrededor de ${min}`, `• Group size: around ${min} people`),
    );
  } else if (max) {
    lines.push(tr(lang, `• Cantidad de personas: hasta ${max}`, `• Group size: up to ${max} people`));
  }

  const opening = tr(
    lang,
    '¡Hola! Quisiera pedir un presupuesto para organizar un retiro en House of Shakti.',
    "Hi! I'd like to request a quote to host a retreat at House of Shakti.",
  );
  const closing = tr(
    lang,
    '¿Me podrían compartir disponibilidad y precios? ¡Gracias!',
    'Could you share availability and pricing? Thank you!',
  );

  return [opening, lines.join('\n'), closing].filter(Boolean).join('\n\n');
}

// A legend sits on the fieldset's own top rule, which is exactly where the
// site's eyebrows sit — so the rule is the fieldset's border, and the label
// interrupts it. The right padding is the breath between the words and where
// the line resumes.
function Legend({ children }: { children: React.ReactNode }) {
  return <legend className={`${LABEL} pr-3`}>{children}</legend>;
}

export function HostQuoteForm() {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  // The earliest date on offer is today — read after mount, so the server
  // and the first client render agree on the markup whatever timezone
  // either is in.
  const [today, setToday] = useState<string | undefined>(undefined);
  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    setToday(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);

  const message = useMemo(() => composeMessage(lang, answers), [lang, answers]);
  const href = whatsappUrl(message);

  const otherChosen = answers.kind === 'other';

  return (
    <section id="quote" className="bg-warm-white py-20 lg:py-28 scroll-mt-20 lg:scroll-mt-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-3 lg:gap-12">
        {/* ── Left — the invitation ───────────────────────────────────── */}
        <div className="lg:col-span-1 lg:pr-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            {tr(lang, 'Pedí tu presupuesto', 'Request a quote')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-10 max-w-full lg:max-w-xs"
          >
            {tr(
              lang,
              'El precio depende de las fechas, el tamaño del grupo y los servicios que elijas. Contanos lo esencial y seguimos la conversación por WhatsApp.',
              "Prices depend on your dates, group size and the services you choose. Share the essentials and we'll continue the conversation on WhatsApp.",
            )}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="font-body text-xs text-ink/75 leading-[1.7] mt-8 lg:mt-10 max-w-full lg:max-w-xs"
          >
            {tr(
              lang,
              'Solemos responder dentro de las 24 horas.',
              'We typically respond within 24 hours.',
            )}
          </motion.p>
        </div>

        {/* ── Right — the three questions ────────────────────────────── */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
          className="lg:col-span-2 mt-12 lg:mt-0"
          // Enter in a field does what the button does: the form has no
          // server, only the link.
          onSubmit={(e) => {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
          }}
        >
          {/* What */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{tr(lang, '¿Qué tipo de retiro?', 'What kind of retreat?')}</Legend>
            <div className="flex flex-wrap gap-2.5 mt-5">
              {KINDS.map((kind) => {
                const selected = answers.kind === kind.id;
                const Icon = kind.icon;
                return (
                  <button
                    key={kind.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => set('kind', selected ? null : kind.id)}
                    className={`flex items-center gap-2.5 border px-4 py-2.5 font-body text-[13px] leading-none transition-colors duration-300 ${
                      selected
                        ? 'border-ink bg-ink text-cream'
                        : 'border-ink/25 text-ink hover:border-ink'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden />
                    <span>{kind.label(lang)}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {otherChosen && (
                <motion.div
                  key="other"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 max-w-md">
                    <label htmlFor="quote-other" className={LABEL}>
                      {tr(lang, 'Contanos más', 'Tell us more')}
                    </label>
                    <input
                      id="quote-other"
                      type="text"
                      value={answers.other}
                      onChange={(e) => set('other', e.target.value)}
                      placeholder={tr(lang, 'Un retiro de…', 'A retreat of…')}
                      maxLength={80}
                      className={`${FIELD} mt-1`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </fieldset>

          {/* When */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{tr(lang, 'Fechas', 'Dates')}</Legend>
            <p className="font-body text-xs text-ink/75 leading-[1.7] mt-2">
              {tr(
                lang,
                'Pueden ser aproximadas: el precio varía según la temporada.',
                'Approximate is fine — prices vary by season.',
              )}
            </p>
            <div className="grid grid-cols-2 gap-6 md:gap-10 mt-5 max-w-md">
              <div>
                <label htmlFor="quote-from" className={LABEL}>
                  {tr(lang, 'Desde', 'From')}
                </label>
                <input
                  id="quote-from"
                  type="date"
                  value={answers.from}
                  min={today}
                  onChange={(e) => set('from', e.target.value)}
                  className={`${FIELD} mt-1`}
                />
              </div>
              <div>
                <label htmlFor="quote-to" className={LABEL}>
                  {tr(lang, 'Hasta', 'To')}
                </label>
                <input
                  id="quote-to"
                  type="date"
                  value={answers.to}
                  min={answers.from || today}
                  onChange={(e) => set('to', e.target.value)}
                  className={`${FIELD} mt-1`}
                />
              </div>
            </div>
          </fieldset>

          {/* How many */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{tr(lang, 'Cantidad de personas', 'Group size')}</Legend>
            <p className="font-body text-xs text-ink/75 leading-[1.7] mt-2">
              {tr(lang, 'Con un estimado alcanza.', 'An estimate is enough.')}
            </p>
            <div className="grid grid-cols-2 gap-6 md:gap-10 mt-5 max-w-md">
              <div>
                <label htmlFor="quote-min" className={LABEL}>
                  {tr(lang, 'Mínimo', 'Minimum')}
                </label>
                <input
                  id="quote-min"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={99}
                  value={answers.min}
                  onChange={(e) => set('min', e.target.value)}
                  placeholder="8"
                  className={`${NUMBER} mt-1`}
                />
              </div>
              <div>
                <label htmlFor="quote-max" className={LABEL}>
                  {tr(lang, 'Máximo', 'Maximum')}
                </label>
                <input
                  id="quote-max"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={99}
                  value={answers.max}
                  onChange={(e) => set('max', e.target.value)}
                  placeholder="14"
                  className={`${NUMBER} mt-1`}
                />
              </div>
            </div>
          </fieldset>

          {/* The door */}
          <div className="border-t border-ink/10 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block self-start bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300"
              >
                {tr(lang, 'Pedir presupuesto por WhatsApp', 'Request a quote on WhatsApp')}
              </a>
              <p className="font-body text-xs text-ink/75 leading-[1.7]">
                {tr(
                  lang,
                  'Abre WhatsApp con tu mensaje ya escrito.',
                  'Opens WhatsApp with your message already written.',
                )}
              </p>
            </div>

            {/* What will be sent, as it will be sent. Quiet, and read-only:
                the place to change it is the conversation itself. */}
            <div className="mt-8 border border-ink/10 px-5 py-4 max-w-xl">
              <p className={LABEL}>{tr(lang, 'Tu mensaje', 'Your message')}</p>
              <p className="font-body text-[13px] text-ink/80 leading-[1.7] whitespace-pre-line mt-3">
                {message}
              </p>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
