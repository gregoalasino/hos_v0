'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { es as esLocale, enUS } from 'date-fns/locale';
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Ticket, Percent, DollarSign, Gift, Users, TrendingUp, CheckCircle,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ADMIN_SAGE, ADMIN_TERRA } from '@/components/admin/DashboardLayout';
import type { Upsell } from '@/types';
import { useLanguage } from '@/contexts/language-context';

type SerializedReferralCode = {
  id: string;
  code: string;
  partnerName: string;
  description: string;
  benefitType: 'percentage' | 'fixed' | 'free_upsell';
  discountPercent?: number;
  discountFixed?: number;
  freeUpsellId?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  minPurchaseUsd: number;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
};
import { tr, type Lang } from '@/lib/i18n';
import {
  createReferralCode, updateReferralCode, toggleReferralCodeActive, deleteReferralCode,
} from '@/app/actions/referralCodes';

const codeSchema = z.object({
  code: z.string().min(2).max(30).toUpperCase(),
  partnerName: z.string().min(1),
  description: z.string().min(1),
  benefitType: z.enum(['percentage', 'fixed', 'free_upsell']),
  discountPercent: z.coerce.number().min(1).max(100).optional(),
  discountFixed: z.coerce.number().min(0.5).optional(),
  freeUpsellId: z.string().optional(),
  usageLimit: z.coerce.number().min(1).optional().or(z.literal('')),
  minPurchaseUsd: z.coerce.number().min(0),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
});
type CodeForm = z.infer<typeof codeSchema>;

function benefitLabel(code: SerializedReferralCode, lang: Lang, upsells: Upsell[]): string {
  if (code.benefitType === 'percentage') return `${code.discountPercent}% ${tr(lang, 'descuento', 'off')}`;
  if (code.benefitType === 'fixed') return `$${code.discountFixed} ${tr(lang, 'descuento fijo', 'fixed off')}`;
  const upsell = upsells.find(u => u.id === code.freeUpsellId);
  return upsell ? `${tr(lang, 'Regalo:', 'Gift:')} ${upsell.name}` : tr(lang, 'Upsell gratis', 'Free upsell');
}

function BenefitIcon({ type }: { type: SerializedReferralCode['benefitType'] }) {
  if (type === 'percentage') return <Percent className="w-3.5 h-3.5" />;
  if (type === 'fixed') return <DollarSign className="w-3.5 h-3.5" />;
  return <Gift className="w-3.5 h-3.5" />;
}

export default function RefersClient({
  initialCodes,
  upsells,
}: {
  initialCodes: SerializedReferralCode[];
  upsells: Upsell[];
}) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SerializedReferralCode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedReferralCode | null>(null);

  const totalUses = initialCodes.reduce((acc, c) => acc + c.usageCount, 0);
  const activeCodes = initialCodes.filter(c => c.isActive).length;

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(code: SerializedReferralCode) {
    setEditing(code);
    setModalOpen(true);
  }

  function handleSave(data: CodeForm) {
    const payload = {
      code: data.code,
      partnerName: data.partnerName,
      description: data.description,
      benefitType: data.benefitType,
      discountPercent: data.benefitType === 'percentage' ? Number(data.discountPercent) : undefined,
      discountFixed: data.benefitType === 'fixed' ? Number(data.discountFixed) : undefined,
      freeUpsellId: data.benefitType === 'free_upsell' ? data.freeUpsellId : undefined,
      isActive: true,
      usageLimit: data.usageLimit !== '' && data.usageLimit !== undefined ? Number(data.usageLimit) : undefined,
      minPurchaseUsd: Number(data.minPurchaseUsd),
      validFrom: data.validFrom || undefined,
      validUntil: data.validUntil || undefined,
    };
    startTransition(async () => {
      if (editing) {
        await updateReferralCode(editing.id, payload);
      } else {
        await createReferralCode(payload);
      }
      setModalOpen(false);
      router.refresh();
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleReferralCodeActive(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteReferralCode(id);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{tr(lang, 'Códigos de referido', 'Refer Codes')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {tr(lang, 'Gestioná los códigos de socios y descuentos para tus reservas.', 'Manage partner codes and discounts for your bookings.')}
          </p>
        </div>
        <Button onClick={openCreate} className="text-white gap-2 flex-shrink-0" style={{ backgroundColor: ADMIN_SAGE }}>
          <Plus className="w-4 h-4" />
          {tr(lang, 'Nuevo código', 'New code')}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Ticket, label: tr(lang, 'Total de códigos', 'Total codes'), value: initialCodes.length, color: ADMIN_SAGE },
          { icon: CheckCircle, label: tr(lang, 'Activos', 'Active'), value: activeCodes, color: '#16a34a' },
          { icon: Users, label: tr(lang, 'Usos totales', 'Total uses'), value: totalUses, color: '#2563eb' },
          { icon: TrendingUp, label: tr(lang, 'Socios', 'Partners'), value: new Set(initialCodes.map(c => c.partnerName)).size, color: ADMIN_TERRA },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}18` }}>
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {initialCodes.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{tr(lang, 'No hay códigos aún. Creá el primero.', 'No codes yet. Create the first one.')}</p>
          </div>
        )}

        {initialCodes.map((code) => {
          const isExpired = code.validUntil && new Date() > new Date(code.validUntil);
          const usagePct = code.usageLimit ? Math.round((code.usageCount / code.usageLimit) * 100) : null;

          return (
            <div
              key={code.id}
              className={cn(
                'bg-white rounded-xl border shadow-sm p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity',
                !code.isActive && 'opacity-60',
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: code.benefitType === 'percentage' ? '#4a7c5918' : code.benefitType === 'fixed' ? '#2563eb18' : '#c4622d18',
                    color: code.benefitType === 'percentage' ? ADMIN_SAGE : code.benefitType === 'fixed' ? '#2563eb' : ADMIN_TERRA,
                  }}
                >
                  <BenefitIcon type={code.benefitType} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-slate-800 tracking-wider bg-slate-100 px-2 py-0.5 rounded">{code.code}</span>
                    {!code.isActive && (
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{tr(lang, 'Inactivo', 'Inactive')}</span>
                    )}
                    {isExpired && (
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-red-400 bg-red-50 px-1.5 py-0.5 rounded">{tr(lang, 'Vencido', 'Expired')}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{code.partnerName}</p>
                </div>
              </div>

              <div className="hidden lg:block w-44 flex-shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">{tr(lang, 'Beneficio', 'Benefit')}</p>
                <p className="text-sm font-semibold text-slate-700">{benefitLabel(code, lang, upsells)}</p>
              </div>

              <div className="hidden lg:block w-36 flex-shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{tr(lang, 'Usos', 'Uses')}</p>
                <p className="text-sm text-slate-700">{code.usageCount}{code.usageLimit ? ` / ${code.usageLimit}` : ''}</p>
                {usagePct !== null && (
                  <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: usagePct >= 90 ? ADMIN_TERRA : ADMIN_SAGE }} />
                  </div>
                )}
              </div>

              <div className="hidden lg:block w-36 flex-shrink-0 text-xs text-slate-500">
                {(code.validFrom || code.validUntil) ? (
                  <>
                    {code.validFrom && <p>{tr(lang, 'Desde', 'From')} {format(new Date(code.validFrom), 'd MMM yy', { locale: lang === 'es' ? esLocale : enUS })}</p>}
                    {code.validUntil && <p>{tr(lang, 'Hasta', 'Until')} {format(new Date(code.validUntil), 'd MMM yy', { locale: lang === 'es' ? esLocale : enUS })}</p>}
                  </>
                ) : (
                  <p className="text-slate-400">{tr(lang, 'Sin vencimiento', 'No expiry')}</p>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => handleToggle(code.id)}
                  disabled={isPending}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title={code.isActive ? tr(lang, 'Desactivar', 'Deactivate') : tr(lang, 'Activar', 'Activate')}
                >
                  {code.isActive
                    ? <ToggleRight className="w-5 h-5" style={{ color: ADMIN_SAGE }} />
                    : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                </button>
                <button onClick={() => openEdit(code)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(code)} className="p-2 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSave={handleSave}
        lang={lang}
        upsells={upsells}
        isPending={isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr(lang, '¿Eliminar código?', 'Delete code?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {tr(lang, `Esto eliminará el código "${deleteTarget?.code}" de forma permanente.`, `This will permanently delete the code "${deleteTarget?.code}".`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr(lang, 'Cancelar', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && handleDelete(deleteTarget.id)} className="bg-red-600 hover:bg-red-700 text-white">
              {tr(lang, 'Eliminar', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CodeModal({
  open, onClose, editing, onSave, lang, upsells, isPending,
}: {
  open: boolean;
  onClose: () => void;
  editing: SerializedReferralCode | null;
  onSave: (data: CodeForm) => void;
  lang: Lang;
  upsells: Upsell[];
  isPending: boolean;
}) {
  const activeUpsells = upsells.filter(u => u.isActive);

  const form = useForm<CodeForm>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: '', partnerName: '', description: '',
      benefitType: 'percentage', discountPercent: 10,
      freeUpsellId: activeUpsells[0]?.id ?? '',
      usageLimit: '', minPurchaseUsd: 0, validFrom: '', validUntil: '',
    },
  });

  const benefitType = form.watch('benefitType');

  function handleOpenChange(open: boolean) {
    if (open && editing) {
      form.reset({
        code: editing.code,
        partnerName: editing.partnerName,
        description: editing.description,
        benefitType: editing.benefitType,
        discountPercent: editing.discountPercent ?? 10,
        discountFixed: editing.discountFixed,
        freeUpsellId: editing.freeUpsellId ?? activeUpsells[0]?.id ?? '',
        usageLimit: editing.usageLimit ?? '',
        minPurchaseUsd: editing.minPurchaseUsd,
        validFrom: editing.validFrom ? format(editing.validFrom, 'yyyy-MM-dd') : '',
        validUntil: editing.validUntil ? format(editing.validUntil, 'yyyy-MM-dd') : '',
      });
    } else if (open) {
      form.reset({
        code: '', partnerName: '', description: '',
        benefitType: 'percentage', discountPercent: 10,
        freeUpsellId: activeUpsells[0]?.id ?? '',
        usageLimit: '', minPurchaseUsd: 0, validFrom: '', validUntil: '',
      });
    }
    if (!open) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? tr(lang, 'Editar código', 'Edit code') : tr(lang, 'Nuevo código de referido', 'New refer code')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pt-2">
            <div className="space-y-3">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr(lang, 'Código', 'Code')}</FormLabel>
                  <FormControl>
                    <Input placeholder="SURF-CAMP" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} className="font-mono uppercase" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="partnerName" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr(lang, 'Nombre del socio / empresa', 'Partner / business name')}</FormLabel>
                  <FormControl><Input placeholder="Nosara Surf Camp" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr(lang, 'Descripción interna', 'Internal description')}</FormLabel>
                  <FormControl><Input placeholder={tr(lang, '20% para clientes del surf camp', '20% off for surf camp clients')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div>
              <FormField control={form.control} name="benefitType" render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'percentage', icon: Percent, label: tr(lang, '% descuento', '% discount') },
                      { value: 'fixed', icon: DollarSign, label: tr(lang, 'Fijo ($)', 'Fixed ($)') },
                      { value: 'free_upsell', icon: Gift, label: tr(lang, 'Upsell gratis', 'Free upsell') },
                    ] as const).map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-colors',
                          field.value === opt.value
                            ? 'border-slate-800 bg-slate-50 text-slate-800'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300',
                        )}
                      >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="mt-3">
                {benefitType === 'percentage' && (
                  <FormField control={form.control} name="discountPercent" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr(lang, 'Porcentaje de descuento (%)', 'Discount percentage (%)')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="number" min={1} max={100} placeholder="10" {...field} className="pr-8" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                {benefitType === 'fixed' && (
                  <FormField control={form.control} name="discountFixed" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr(lang, 'Monto de descuento (USD)', 'Discount amount (USD)')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                          <Input type="number" min={0.5} step={0.5} placeholder="5" {...field} className="pl-7" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                {benefitType === 'free_upsell' && (
                  <FormField control={form.control} name="freeUpsellId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr(lang, 'Upsell a regalar', 'Free upsell to give')}</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                          {activeUpsells.map(u => (
                            <option key={u.id} value={u.id}>{u.name} (${u.priceUsd})</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="minPurchaseUsd" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tr(lang, 'Compra mínima (USD)', 'Min. purchase (USD)')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <Input type="number" min={0} step={1} placeholder="0" {...field} className="pl-7" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="usageLimit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tr(lang, 'Límite de usos', 'Usage limit')}{' '}
                      <span className="text-slate-400 font-normal">({tr(lang, 'opcional', 'optional')})</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step={1} placeholder={tr(lang, 'Ilimitado', 'Unlimited')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="validFrom" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tr(lang, 'Válido desde', 'Valid from')}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="validUntil" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tr(lang, 'Válido hasta', 'Valid until')}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="flex gap-3 pt-1 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">{tr(lang, 'Cancelar', 'Cancel')}</Button>
              <Button type="submit" className="flex-1 text-white" style={{ backgroundColor: ADMIN_SAGE }} disabled={isPending}>
                {editing ? tr(lang, 'Guardar cambios', 'Save changes') : tr(lang, 'Crear código', 'Create code')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
