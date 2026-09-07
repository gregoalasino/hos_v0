'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
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
// written out in advance. Nothing here is typed: every answer is a tap on a
// chip, so on a phone the whole form is four thumbs' worth of choosing. The
// answers compose the opening line of that conversation as they are given,
// in whichever language the reader is reading, and the button hands it to
// WhatsApp already written. Exact dates and head counts are what the
// conversation itself is for; a month, a length and a bracket are enough to
// quote a season and a house.
//
// The house's general number, via lib/whatsapp — the same door the floating
// button's "Host Your Retreat" entry opens.

type Option = {
  id: string;
  icon?: LucideIcon;
  label: (lang: Lang) => string;
};

// What a retreat can be. The first six are the owners' list; the rest are the
// kinds of gathering that actually come to Santa Teresa, so a host finds
// their own without reaching for "Other". Each carries a thin lucide mark —
// the same family the rest of the site's controls draw from.
const KINDS: Option[] = [
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

// How long. Brackets rather than a count: a host planning a retreat knows
// "about a week" long before they know the nights.
const LENGTHS: Option[] = [
  { id: '3-4', label: (l) => tr(l, '3–4 noches', '3–4 nights') },
  { id: '5-6', label: (l) => tr(l, '5–6 noches', '5–6 nights') },
  { id: '7', label: (l) => tr(l, '7 noches', '7 nights') },
  { id: '8+', label: (l) => tr(l, '8 noches o más', '8+ nights') },
];

// How many. The brackets follow the house: Main House sleeps ten, the three
// dwellings together around fifteen, and beyond twenty is a conversation
// about the whole property.
const GROUPS: Option[] = [
  { id: 'up-to-6', label: (l) => tr(l, 'Hasta 6', 'Up to 6') },
  { id: '7-10', label: () => '7–10' },
  { id: '11-14', label: () => '11–14' },
  { id: '15-20', label: () => '15–20' },
  { id: '20+', label: (l) => tr(l, 'Más de 20', 'More than 20') },
];

const FLEXIBLE = 'flexible';

type Answers = {
  kind: string | null;
  /** A month as YYYY-MM, or FLEXIBLE. */
  month: string | null;
  length: string | null;
  group: string | null;
};

const EMPTY: Answers = { kind: null, month: null, length: null, group: null };

const LABEL = 'block font-body text-[10px] tracking-[0.25em] uppercase text-ink/70';

// The next twelve months from today, as YYYY-MM keys. Computed on the client
// only (see the effect below), so the server and the first client render
// agree on the markup whatever month or timezone either is in.
function upcomingMonths(from: Date, count = 12): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
}

// "March 2027" / "Marzo 2027" — the chip and the message use the same words.
function monthLabel(key: string, lang: Lang): string {
  const [y, m] = key.split('-').map(Number);
  const name = new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en-US', { month: 'long' }).format(
    new Date(y, m - 1, 1),
  );
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

function composeMessage(lang: Lang, a: Answers): string {
  const lines: string[] = [];

  const kind = KINDS.find((k) => k.id === a.kind);
  if (kind) lines.push(tr(lang, `• Retiro: ${kind.label(lang)}`, `• Retreat: ${kind.label(lang)}`));

  const when: string[] = [];
  if (a.month === FLEXIBLE) when.push(tr(lang, 'fechas flexibles', 'flexible dates'));
  else if (a.month) when.push(monthLabel(a.month, lang));
  const length = LENGTHS.find((l) => l.id === a.length);
  if (length) when.push(length.label(lang).toLowerCase());
  if (when.length) lines.push(tr(lang, `• Cuándo: ${when.join(', ')}`, `• When: ${when.join(', ')}`));

  const group = GROUPS.find((g) => g.id === a.group);
  if (group) {
    const people = tr(
      lang,
      group.id === 'up-to-6' ? 'hasta 6' : group.id === '20+' ? 'más de 20' : group.label(lang),
      group.id === 'up-to-6'
        ? 'up to 6 people'
        : group.id === '20+'
          ? 'more than 20 people'
          : `${group.label(lang)} people`,
    );
    lines.push(tr(lang, `• Cantidad de personas: ${people}`, `• Group size: ${people}`));
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
function Legend({ children }: { children: ReactNode }) {
  return <legend className={`${LABEL} pr-3`}>{children}</legend>;
}

// One row of choices, one of which can be down. Square, hairline, and the
// chosen one inverts to ink — the same states the track arrows and the
// lightbox thumbnails already use. Tapping the chosen chip lets go of it.
function Chips({
  options,
  value,
  onChange,
  lang,
}: {
  options: Option[];
  value: string | null;
  onChange: (next: string | null) => void;
  lang: Lang;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const selected = value === option.id;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? null : option.id)}
            className={`flex items-center gap-2.5 border px-4 py-2.5 font-body text-[13px] leading-none transition-colors duration-300 ${
              selected ? 'border-ink bg-ink text-cream' : 'border-ink/25 text-ink hover:border-ink'
            }`}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden />}
            <span>{option.label(lang)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function HostQuoteForm() {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  // The months on offer start from today — read after mount, see upcomingMonths.
  const [months, setMonths] = useState<string[]>([]);
  useEffect(() => setMonths(upcomingMonths(new Date())), []);

  const monthOptions = useMemo<Option[]>(
    () => [
      { id: FLEXIBLE, label: (l) => tr(l, 'Fechas flexibles', 'Flexible dates') },
      ...months.map((key) => ({ id: key, label: (l: Lang) => monthLabel(key, l) })),
    ],
    [months],
  );

  const message = useMemo(() => composeMessage(lang, answers), [lang, answers]);
  const href = whatsappUrl(message);

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
              'El precio depende de las fechas, el tamaño del grupo y los servicios que elijas. Elegí lo esencial y seguimos la conversación por WhatsApp.',
              "Prices depend on your dates, group size and the services you choose. Pick the essentials and we'll continue the conversation on WhatsApp.",
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
          // Enter does what the button does: the form has no server, only the link.
          onSubmit={(e) => {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
          }}
        >
          {/* What */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{tr(lang, '¿Qué tipo de retiro?', 'What kind of retreat?')}</Legend>
            <div className="mt-5">
              <Chips options={KINDS} value={answers.kind} onChange={(v) => set('kind', v)} lang={lang} />
            </div>
          </fieldset>

          {/* When */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{tr(lang, '¿Cuándo?', 'When?')}</Legend>
            <p className="font-body text-xs text-ink/75 leading-[1.7] mt-2">
              {tr(
                lang,
                'Con el mes y la duración alcanza: el precio varía según la temporada.',
                'A month and a length are enough — prices vary by season.',
              )}
            </p>
            <div className="mt-5 space-y-6">
              <div>
                <p className={LABEL}>{tr(lang, 'Mes', 'Month')}</p>
                <div className="mt-3">
                  <Chips
                    options={monthOptions}
                    value={answers.month}
                    onChange={(v) => set('month', v)}
                    lang={lang}
                  />
                </div>
              </div>
              <div>
                <p className={LABEL}>{tr(lang, 'Duración', 'How long')}</p>
                <div className="mt-3">
                  <Chips
                    options={LENGTHS}
                    value={answers.length}
                    onChange={(v) => set('length', v)}
                    lang={lang}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* How many */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{tr(lang, '¿Cuántas personas?', 'How many people?')}</Legend>
            <p className="font-body text-xs text-ink/75 leading-[1.7] mt-2">
              {tr(lang, 'Con un estimado alcanza.', 'An estimate is enough.')}
            </p>
            <div className="mt-5">
              <Chips options={GROUPS} value={answers.group} onChange={(v) => set('group', v)} lang={lang} />
            </div>
          </fieldset>

          {/* The door */}
          <div className="border-t border-ink/10 pt-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
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
        </motion.form>
      </div>
    </section>
  );
}
