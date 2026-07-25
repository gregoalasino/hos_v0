import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip if Supabase is not configured yet
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — do not remove this
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role as string | undefined;

  // ── /login — login del admin ───────────────────────────────────────────────
  // Si el admin ya tiene sesión activa y va al login, lo mandamos al dashboard
  if (pathname === '/login' && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // ── /admin/* — panel de administración ────────────────────────────────────
  // Requiere sesión con role='admin'. Excluimos /login (ya es top-level).
  if (pathname.startsWith('/admin')) {
    if (!user || role !== 'admin') {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname); // opcional: volver después del login
      return NextResponse.redirect(url);
    }
  }

  // ── /instructor/* — portal de instructores ─────────────────────────────────
  // /instructor/login es pública; el resto requiere role='instructor'
  if (pathname.startsWith('/instructor') && pathname !== '/instructor/login') {
    if (!user || role !== 'instructor') {
      return NextResponse.redirect(new URL('/instructor/login', request.url));
    }
  }

  // Si el instructor ya tiene sesión y va a su login, al dashboard
  if (pathname === '/instructor/login' && role === 'instructor') {
    return NextResponse.redirect(new URL('/instructor', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
