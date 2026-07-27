import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="font-display text-3xl font-light text-dark mb-3">
          ¡Reserva confirmada!
        </h1>
        <p className="text-muted-foreground mb-8">
          Tu reserva fue procesada exitosamente. Recibirás un email de confirmación con todos los detalles.
        </p>

        <div className="bg-cream rounded-2xl p-6 mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
            Nos vemos en el shala
          </p>
          <p className="font-display text-xl text-dark">
            House of Shakti · Costa Rica
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full h-12">
              Ir al inicio
            </Button>
          </Link>
          <Link href="/yoga" className="flex-1">
            <Button className="w-full bg-dark hover:bg-burgundy text-cream h-12">
              Más clases
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
