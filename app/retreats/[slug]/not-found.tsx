import Link from 'next/link';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';

// Minimal editorial 404 for an unknown retreat slug.
export default function RetreatNotFound() {
  return (
    <main className="bg-warm-white min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-xl">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">
            404
          </p>
          <h1 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mt-6">
            This retreat is not currently active.
          </h1>
          <p className="font-body text-sm text-ink leading-relaxed mt-8">
            The page you were looking for may have moved or the retreat is no longer
            on our calendar.
          </p>
          <Link
            href="/retreats"
            className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-10"
          >
            Return to all retreats
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
