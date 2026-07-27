import Link from 'next/link';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { Check, X, AlertCircle } from 'lucide-react';

type Copy = { icon: 'ok' | 'declined' | 'error'; title: string; body: string };

const OK_BODY: Record<string, string> = {
  pack: "Thank you! Your class pack is confirmed. We've emailed your personal class code — use it at checkout to book each class for free.",
  booking:
    "Thank you! Your class is booked and your payment is confirmed. We look forward to seeing you on the mat.",
};

function copyFor(status: string, kind: string): Copy {
  if (status === 'ok') {
    return { icon: 'ok', title: kind === 'booking' ? 'Booking confirmed' : 'Payment received', body: OK_BODY[kind] ?? OK_BODY.pack };
  }
  if (status === 'declined') {
    return {
      icon: 'declined',
      title: 'Payment not completed',
      body: 'Your payment was declined or cancelled. No charge was made. You can try again whenever you like.',
    };
  }
  return {
    icon: 'error',
    title: 'Something went wrong',
    body: "We couldn't confirm your payment automatically. If you were charged, don't worry — contact us and we'll sort it out right away.",
  };
}

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; kind?: string }>;
}) {
  const { status, kind } = await searchParams;
  const c = copyFor(status ?? 'error', kind ?? 'pack');

  return (
    <>
      <Navigation />
      <main className="bg-warm-white min-h-screen">
        <section className="w-[90%] md:w-[80%] max-w-2xl mx-auto pt-36 pb-28">
          <div className="border border-ink/15 bg-white p-10 md:p-14">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                c.icon === 'ok' ? 'bg-cream' : c.icon === 'declined' ? 'bg-cream' : 'bg-cream'
              }`}
            >
              {c.icon === 'ok' && <Check width={26} height={26} strokeWidth={1.5} className="text-ink" />}
              {c.icon === 'declined' && <X width={26} height={26} strokeWidth={1.5} className="text-ink" />}
              {c.icon === 'error' && (
                <AlertCircle width={26} height={26} strokeWidth={1.5} className="text-ink" />
              )}
            </div>
            <h1 className="font-display text-3xl font-light text-ink mt-7">{c.title}</h1>
            <p className="font-body text-sm text-ink/70 mt-4 leading-relaxed">{c.body}</p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/yoga"
                className="bg-ink text-warm-white font-body text-sm tracking-[0.1em] uppercase px-6 py-3 hover:bg-dark transition-colors duration-200"
              >
                Book a class
              </Link>
              {status !== 'ok' && (
                <Link
                  href="/paquetes"
                  className="border border-ink/25 text-ink font-body text-sm tracking-[0.1em] uppercase px-6 py-3 hover:bg-cream/60 transition-colors duration-200"
                >
                  Try again
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
