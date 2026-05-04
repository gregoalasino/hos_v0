import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';

type Step = {
  number: number;
  es: string;
  en: string;
};

const STEPS: Step[] = [
  { number: 1, es: 'Detalles',  en: 'Details'  },
  { number: 2, es: 'Extras',    en: 'Add-ons'  },
  { number: 3, es: 'Tus datos', en: 'Your info' },
  { number: 4, es: 'Pago',      en: 'Payment'  },
];

type Props = {
  current: number;
};

export default function BookingStep({ current }: Props) {
  const { lang } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const done   = current > step.number;
        const active = current === step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  done   && 'bg-burgundy text-cream',
                  active && 'bg-dark text-cream ring-4 ring-dark/20',
                  !done && !active && 'bg-cream text-dark/40 border border-dark/20'
                )}
              >
                {done ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-xs hidden sm:block transition-colors duration-300',
                  active ? 'text-dark font-medium' : 'text-dark/40'
                )}
              >
                {tr(lang, step.es, step.en)}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-px w-12 sm:w-16 mx-2 mb-5 transition-colors duration-300',
                  current > step.number ? 'bg-burgundy' : 'bg-dark/15'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
