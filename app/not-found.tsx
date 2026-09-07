import { FONT_VARIABLES } from '@/lib/fonts';
import '@/app/globals.css';

// The 404 for URLs that no root layout claims — in practice only stray paths
// under /admin, /instructor and /api, since the proxy rewrites every public
// path under app/[locale], whose own not-found.tsx renders the site's 404 in
// the language of the URL, inside the site's own layout.
//
// There is no root layout above this file (each area has its own), so Next
// supplies the document itself. The font variables ride on the wrapper
// instead of on <html>; they cascade the same.
export default function RootNotFound() {
  return (
    <main
      id="main-content"
      className={`${FONT_VARIABLES} font-body antialiased bg-warm-white min-h-screen flex items-center justify-center`}
    >
      <div className="max-w-md mx-auto px-6 text-center">
        <h1 className="font-display font-light text-ink text-3xl md:text-4xl lg:text-5xl leading-[1.1]">
          This page doesn&apos;t live here.
        </h1>
        <p className="font-body text-base text-ink leading-relaxed mt-8">
          The page you&apos;re looking for may have moved, or perhaps never existed at all.
        </p>
        <a
          href="/"
          className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-12"
        >
          Return home
        </a>
      </div>
    </main>
  );
}
