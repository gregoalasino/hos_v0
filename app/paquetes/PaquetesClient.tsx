'use client';

import { useState } from 'react';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { startPackCheckout } from '@/app/actions/packs';
import type { ClassPack } from '@/lib/queries/packs';
import { Check } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'error';

export default function PaquetesClient({ packs }: { packs: ClassPack[] }) {
  const [selected, setSelected] = useState<string>(packs[0]?.id ?? '');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const selectedPack = packs.find((p) => p.id === selected);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPack) return;
    if (!form.firstName || !form.lastName || !form.email) {
      setError('Please complete your name and email.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError('');
    const res = await startPackCheckout({
      packId: selectedPack.id,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
    });
    if (res.ok) {
      // Hand off to Tilopay's secure hosted payment page.
      window.location.href = res.url;
    } else {
      setError(
        res.error === 'payment_init_failed'
          ? 'We could not start the payment. Please try again in a moment.'
          : 'Something went wrong. Please try again.',
      );
      setStatus('error');
    }
  }

  return (
    <>
      <Navigation />
      <main className="bg-warm-white min-h-screen">
        <section className="w-[90%] md:w-[80%] max-w-5xl mx-auto pt-32 pb-24">
          <h1 className="font-display text-4xl md:text-5xl font-light text-ink leading-tight">
            Class packs
          </h1>
          <p className="font-body text-base text-ink/70 mt-4 max-w-xl leading-relaxed">
            Practice at your own rhythm. Buy a pack of classes and book whenever you like — we&apos;ll
            send you a personal code to redeem, one class at a time.
          </p>

          {(
            <div className="mt-14 grid md:grid-cols-2 gap-12 lg:gap-20">
              {/* Pack selection */}
              <div>
                <h2 className="font-body text-[11px] tracking-[0.2em] uppercase text-ink/50 mb-5">
                  Choose your pack
                </h2>
                <div className="space-y-3">
                  {packs.map((p) => {
                    const perClass = (p.priceUsd / p.classesCount).toFixed(0);
                    const active = p.id === selected;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelected(p.id)}
                        className={`w-full text-left px-5 py-4 border transition-colors duration-200 flex items-center justify-between ${
                          active
                            ? 'border-ink bg-cream/40'
                            : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <div>
                          <p className="font-body text-sm font-medium text-ink">{p.name}</p>
                          <p className="font-body text-xs text-ink/50 mt-0.5">
                            {p.classesCount} classes · ${perClass} each
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-xl font-light text-ink">
                            ${p.priceUsd}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              active ? 'border-ink bg-ink' : 'border-ink/30'
                            }`}
                          >
                            {active && <Check width={11} height={11} className="text-warm-white" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {packs.length === 0 && (
                    <p className="font-body text-sm text-ink/50 italic">
                      No packs available right now.
                    </p>
                  )}
                </div>
              </div>

              {/* Buyer details */}
              <form onSubmit={handleSubmit}>
                <h2 className="font-body text-[11px] tracking-[0.2em] uppercase text-ink/50 mb-5">
                  Your details
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      label="First name"
                      value={form.firstName}
                      onChange={(v) => update('firstName', v)}
                    />
                    <TextField
                      label="Last name"
                      value={form.lastName}
                      onChange={(v) => update('lastName', v)}
                    />
                  </div>
                  <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => update('email', v)}
                  />
                  <TextField
                    label="Phone (optional)"
                    value={form.phone}
                    onChange={(v) => update('phone', v)}
                  />
                </div>

                {error && (
                  <p className="font-body text-xs italic text-burgundy mt-4">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting' || !selectedPack}
                  className="mt-8 w-full bg-ink text-warm-white font-body text-sm tracking-[0.1em] uppercase py-4 hover:bg-dark transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {status === 'submitting'
                    ? 'Processing…'
                    : selectedPack
                    ? `Continue · $${selectedPack.priceUsd}`
                    : 'Continue'}
                </button>
                <p className="font-body text-xs text-ink/40 mt-4 leading-relaxed">
                  You&apos;ll be taken to Tilopay&apos;s secure page to pay by card. Once your payment
                  is confirmed, we&apos;ll email your personal class code.
                </p>
              </form>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block font-body text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2 font-body text-sm text-ink outline-none focus:border-ink transition-colors duration-200"
      />
    </label>
  );
}
