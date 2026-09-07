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
import { useLocale, useTranslations } from 'next-intl';
import { intlTag } from '@/lib/dates';
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
// Every word — chip labels, legends, and each line of the message — comes
// from the catalogue under hostYourRetreat.quote. The message lines are ICU
// templates ("• Group size: {people}"), never pieces glued together, so each
// language phrases its own sentence.
//
// The house's general number, via lib/whatsapp — the same door the floating
// button's "Host Your Retreat" entry opens.

// What a retreat can be. The first six are the owners' list; the rest are the
// kinds of gathering that actually come to Santa Teresa, so a host finds
// their own without reaching for "Other". Each carries a thin lucide mark —
// the same family the rest of the site's controls draw from.
const KINDS = [
  { id: 'yoga', icon: Flower2 },
  { id: 'surfYoga', icon: Waves },
  { id: 'teacherTraining', icon: GraduationCap },
  { id: 'breathwork', icon: Wind },
  { id: 'soundHealing', icon: Music },
  { id: 'aguahara', icon: Droplets },
  { id: 'macrame', icon: Spool },
  { id: 'tarot', icon: MoonStar },
  { id: 'creative', icon: Palette },
  { id: 'other', icon: Ellipsis },
] as const;

// How long. Brackets rather than a count: a host planning a retreat knows
// "about a week" long before they know the nights.
const LENGTHS = ['3to4', '5to6', '7', '8plus'] as const;

// How many. The brackets follow the house: Main House sleeps ten, the three
// dwellings together around fifteen, and beyond twenty is a conversation
// about the whole property. Each bracket knows how to say itself in a
// sentence — "up to 6 people", "7–10 people", "more than 20 people".
const GROUPS = [
  { id: 'upTo6', people: { shape: 'upTo', n: 6 } },
  { id: '7to10', people: { shape: 'range', from: 7, to: 10 } },
  { id: '11to14', people: { shape: 'range', from: 11, to: 14 } },
  { id: '15to20', people: { shape: 'range', from: 15, to: 20 } },
  { id: 'moreThan20', people: { shape: 'moreThan', n: 20 } },
] as const;

type KindId = (typeof KINDS)[number]['id'];
type LengthId = (typeof LENGTHS)[number];
type GroupId = (typeof GROUPS)[number]['id'];

const FLEXIBLE = 'flexible';

type Answers = {
  kind: KindId | null;
  /** A month as YYYY-MM, or FLEXIBLE. */
  month: string | null;
  length: LengthId | null;
  group: GroupId | null;
};

const EMPTY: Answers = { kind: null, month: null, length: null, group: null };

const LABEL = 'block font-body text-[10px] tracking-[0.25em] uppercase text-ink/70';

type Option = { id: string; icon?: LucideIcon; label: string };

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
function monthLabel(key: string, tag: string): string {
  const [y, m] = key.split('-').map(Number);
  const name = new Intl.DateTimeFormat(tag, { month: 'long' }).format(new Date(y, m - 1, 1));
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

type Translate = ReturnType<typeof useTranslations<'hostYourRetreat.quote'>>;

function composeMessage(t: Translate, tag: string, a: Answers): string {
  const lines: string[] = [];

  if (a.kind) lines.push(t('message.retreatLine', { kind: t(`kinds.${a.kind}`) }));

  const when: string[] = [];
  if (a.month === FLEXIBLE) when.push(t('message.flexibleDates'));
  else if (a.month) when.push(monthLabel(a.month, tag));
  if (a.length) when.push(t(`lengths.${a.length}`).toLowerCase());
  if (when.length) lines.push(t('message.whenLine', { when: when.join(', ') }));

  const group = GROUPS.find((g) => g.id === a.group);
  if (group) {
    const { people } = group;
    const phrase =
      people.shape === 'upTo'
        ? t('message.peopleUpTo', { n: people.n })
        : people.shape === 'moreThan'
          ? t('message.peopleMoreThan', { n: people.n })
          : t('message.peopleRange', { from: people.from, to: people.to });
    lines.push(t('message.groupLine', { people: phrase }));
  }

  return [t('message.opening'), lines.join('\n'), t('message.closing')].filter(Boolean).join('\n\n');
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
function Chips<Id extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly (Option & { id: Id })[];
  value: Id | null;
  onChange: (next: Id | null) => void;
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
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function HostQuoteForm() {
  const t = useTranslations('hostYourRetreat.quote');
  const tag = intlTag(useLocale());
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  // The months on offer start from today — read after mount, see upcomingMonths.
  const [months, setMonths] = useState<string[]>([]);
  useEffect(() => setMonths(upcomingMonths(new Date())), []);

  const kindOptions = KINDS.map((k) => ({ id: k.id, icon: k.icon, label: t(`kinds.${k.id}`) }));
  const lengthOptions = LENGTHS.map((id) => ({ id, label: t(`lengths.${id}`) }));
  const groupOptions = GROUPS.map((g) => ({ id: g.id, label: t(`groups.${g.id}`) }));
  const monthOptions = useMemo<Option[]>(
    () => [
      { id: FLEXIBLE, label: t('flexible') },
      ...months.map((key) => ({ id: key, label: monthLabel(key, tag) })),
    ],
    [months, t, tag],
  );

  const message = useMemo(() => composeMessage(t, tag, answers), [t, tag, answers]);
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
            {t('heading')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-10 max-w-full lg:max-w-xs"
          >
            {t('intro')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="font-body text-xs text-ink/75 leading-[1.7] mt-8 lg:mt-10 max-w-full lg:max-w-xs"
          >
            {t('responseTime')}
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
            <Legend>{t('what')}</Legend>
            <div className="mt-5">
              <Chips options={kindOptions} value={answers.kind} onChange={(v) => set('kind', v)} />
            </div>
          </fieldset>

          {/* When */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{t('when')}</Legend>
            <p className="font-body text-xs text-ink/75 leading-[1.7] mt-2">{t('whenHint')}</p>
            <div className="mt-5 space-y-6">
              <div>
                <p className={LABEL}>{t('month')}</p>
                <div className="mt-3">
                  <Chips options={monthOptions} value={answers.month} onChange={(v) => set('month', v)} />
                </div>
              </div>
              <div>
                <p className={LABEL}>{t('length')}</p>
                <div className="mt-3">
                  <Chips options={lengthOptions} value={answers.length} onChange={(v) => set('length', v)} />
                </div>
              </div>
            </div>
          </fieldset>

          {/* How many */}
          <fieldset className="min-w-0 border-t border-ink/10 pt-8 pb-10">
            <Legend>{t('howMany')}</Legend>
            <p className="font-body text-xs text-ink/75 leading-[1.7] mt-2">{t('howManyHint')}</p>
            <div className="mt-5">
              <Chips options={groupOptions} value={answers.group} onChange={(v) => set('group', v)} />
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
              {t('cta')}
            </a>
            <p className="font-body text-xs text-ink/75 leading-[1.7]">{t('ctaNote')}</p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
