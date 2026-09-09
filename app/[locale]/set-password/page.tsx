'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import type { EmailOtpType } from '@supabase/supabase-js';

const BURGUNDY = '#8D0000';

// Landing for admin invitations and password resets. The invite/recovery email
// links here carrying a one-time token; we exchange it for a session, then the
// person picks their password. Placed under app/[locale] (like /login) so it
// inherits the public root layout — the admin panel lives outside the locale
// segment and has no <html> of its own to lend a standalone page.
//
// Access to the panel itself is still gated by user_metadata.role === 'admin'
// (see proxy.ts). This page only sets the password; the role is granted when
// the invite is created (scripts/invite-admins.mjs, or in the Supabase
// dashboard). Setting a password never elevates a role — that needs the
// service key — so a stray visitor here gains nothing.
type Phase = 'verifying' | 'ready' | 'error' | 'saving';

export default function SetPasswordPage() {
  const [supabase] = useState(() => createClient());
  const [phase, setPhase] = useState<Phase>('verifying');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Establish a session from whatever the email link delivered.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. A session may already exist — either the person is signed in, or the
      //    browser client auto-detected tokens from the URL hash (implicit flow).
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (!cancelled) setPhase('ready');
        return;
      }

      const url = new URL(window.location.href);

      // 2. token_hash + type (the robust, server-verifiable invite/recovery flow).
      const tokenHash = url.searchParams.get('token_hash');
      const type = url.searchParams.get('type');
      if (tokenHash && type) {
        const { error: vErr } = await supabase.auth.verifyOtp({
          type: type as EmailOtpType,
          token_hash: tokenHash,
        });
        if (!cancelled && !vErr) {
          setPhase('ready');
          return;
        }
      }

      // 3. PKCE code (best effort — only succeeds if this browser began the flow).
      const code = url.searchParams.get('code');
      if (code) {
        const { error: cErr } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled && !cErr) {
          setPhase('ready');
          return;
        }
      }

      if (!cancelled) setPhase('error');
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setPhase('saving');
    const { error: uErr } = await supabase.auth.updateUser({ password });
    if (uErr) {
      setError(
        'Could not set your password. The link may have expired — ask the studio admin to send a new invitation.',
      );
      setPhase('ready');
      return;
    }

    // Hard navigation so the proxy re-evaluates the fresh session + role.
    window.location.assign('/admin');
  }

  return (
    <div className="admin-scope font-body min-h-screen bg-neutral-50 flex items-center justify-center p-4 text-ink">
      <div className="w-full max-w-sm">
        {/* Logo — House of Shakti monogram */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: BURGUNDY }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/favicon.png"
              alt="House of Shakti"
              className="w-8 h-8 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <h1 className="font-body text-2xl font-normal text-black">Set your password</h1>
          <p className="font-body text-sm text-ink/50 mt-1">House of Shakti · Admin access</p>
        </div>

        <div className="bg-white border border-ink/10 p-6">
          {phase === 'verifying' ? (
            <div className="flex flex-col items-center gap-3 py-6 text-ink/50">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="font-body text-sm">Verifying your invitation…</p>
            </div>
          ) : phase === 'error' ? (
            <div className="space-y-4">
              <div className="bg-burgundy/5 border border-burgundy/20 px-3 py-2.5 text-xs text-burgundy">
                This link is invalid or has expired. Ask the studio admin to send you a
                new invitation.
              </div>
              <Link
                href="/login"
                className="block text-center font-body text-sm text-ink/60 hover:text-ink underline underline-offset-4"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="font-body text-[10px] font-medium text-ink/50 uppercase tracking-[0.15em]"
                >
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="h-10 pr-10 rounded-none bg-white border-ink/20 text-ink placeholder:text-ink/30 focus:border-burgundy focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm"
                  className="font-body text-[10px] font-medium text-ink/50 uppercase tracking-[0.15em]"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirm"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 rounded-none bg-white border-ink/20 text-ink placeholder:text-ink/30 focus:border-burgundy focus-visible:ring-0"
                />
              </div>

              {error && (
                <div className="bg-burgundy/5 border border-burgundy/20 px-3 py-2.5 text-xs text-burgundy">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-10 rounded-none text-white text-sm hover:opacity-90"
                style={{ backgroundColor: BURGUNDY }}
                disabled={phase === 'saving'}
              >
                {phase === 'saving' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving…
                  </>
                ) : (
                  'Set password & enter'
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center font-body text-xs text-ink/40 mt-6">
          House of Shakti · Admin system
        </p>
      </div>
    </div>
  );
}
