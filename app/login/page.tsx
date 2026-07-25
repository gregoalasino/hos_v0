'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const SAGE  = '#4a7c59';
const TERRA = '#c4622d';

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
        setError('Email o contraseña incorrectos.');
        return;
      }

      const role = data.user?.user_metadata?.role;
      if (role !== 'admin') {
        await supabase.auth.signOut();
        setError('Esta cuenta no tiene acceso al panel de administración.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: SAGE }}
          >
            <span className="text-white font-serif text-lg">🌿</span>
          </div>
          <h1 className="text-xl font-semibold text-white">Panel Admin</h1>
          <p className="text-sm text-white/40 mt-1">House of Shakti</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl border border-white/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-white/50 uppercase tracking-wide">
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
                className="h-10 bg-slate-700 border-white/10 text-white placeholder:text-white/25 focus:border-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-white/50 uppercase tracking-wide">
                Contraseña
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
                  className="h-10 pr-10 bg-slate-700 border-white/10 text-white placeholder:text-white/25 focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-xs text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 text-white text-sm"
              style={{ backgroundColor: TERRA }}
              disabled={loading}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Ingresando…</>
                : 'Ingresar'
              }
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          House of Shakti · Sistema de administración
        </p>
      </div>
    </div>
  );
}
