'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const BURGUNDY = '#8D0000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Incorrect email or password.');
        return;
      }

      const role = data.user?.user_metadata?.role;
      if (role !== 'admin') {
        await supabase.auth.signOut();
        setError('This account does not have access to the admin panel.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-scope font-body min-h-screen bg-neutral-50 flex items-center justify-center p-4 text-ink">
      <div className="w-full max-w-sm">

        {/* Logo — House of Shakti monogram (from /public) */}
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
            />
          </div>
          <h1 className="font-body text-2xl font-normal text-black">Admin Panel</h1>
          <p className="font-body text-sm text-ink/50 mt-1">House of Shakti</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-ink/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-body text-[10px] font-medium text-ink/50 uppercase tracking-[0.15em]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@houseofshakti.com"
                className="h-10 rounded-none bg-white border-ink/20 text-ink placeholder:text-ink/30 focus:border-burgundy focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-body text-[10px] font-medium text-ink/50 uppercase tracking-[0.15em]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 pr-10 rounded-none bg-white border-ink/20 text-ink placeholder:text-ink/30 focus:border-burgundy focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
              disabled={loading}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in…</>
                : 'Sign in'
              }
            </Button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-ink/40 mt-6">
          House of Shakti · Admin system
        </p>
      </div>
    </div>
  );
}
