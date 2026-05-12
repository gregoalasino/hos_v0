'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Upsell } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';
import { createUpsell, updateUpsell, toggleUpsellActive, deleteUpsell } from '@/app/actions/upsells';

const upsellSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceUsd: z.coerce.number().min(0),
  isActive: z.boolean(),
});
type UpsellForm = z.infer<typeof upsellSchema>;

const TERRA = '#c4622d';

export default function UpsellsClient({ initialUpsells }: { initialUpsells: Upsell[] }) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Upsell | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<UpsellForm>({
    resolver: zodResolver(upsellSchema),
    defaultValues: { name: '', description: '', priceUsd: 0, isActive: true },
  });

  function openCreate() {
    setEditing(undefined);
    form.reset({ name: '', description: '', priceUsd: 0, isActive: true });
    setModalOpen(true);
  }

  function openEdit(u: Upsell) {
    setEditing(u);
    form.reset({ name: u.name, description: u.description, priceUsd: u.priceUsd, isActive: u.isActive });
    setModalOpen(true);
  }

  function onSubmit(values: UpsellForm) {
    startTransition(async () => {
      if (editing) {
        await updateUpsell(editing.id, values);
      } else {
        await createUpsell(values);
      }
      setModalOpen(false);
      router.refresh();
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleUpsellActive(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteUpsell(id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <div className="p-5 lg:p-7 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Upsells</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {tr(lang, 'Productos y servicios adicionales disponibles al reservar', 'Additional products and services available at booking')}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 text-xs text-white" style={{ backgroundColor: TERRA }}>
          <Plus className="w-3.5 h-3.5" />
          {tr(lang, 'Nuevo upsell', 'New upsell')}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {initialUpsells.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{u.name}</h3>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${u.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                  >
                    {u.isActive ? tr(lang, 'Activo', 'Active') : tr(lang, 'Inactivo', 'Inactive')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{u.description}</p>
              </div>
              <span className="text-lg font-bold text-slate-800 flex-shrink-0">${u.priceUsd}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <Switch
                  checked={u.isActive}
                  onCheckedChange={() => handleToggle(u.id)}
                  disabled={isPending}
                  className="scale-75 origin-left"
                />
                <span className="text-xs text-slate-400">
                  {u.isActive ? tr(lang, 'Visible', 'Visible') : tr(lang, 'Oculto', 'Hidden')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-400 hover:text-slate-700" onClick={() => openEdit(u)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-400 hover:text-red-500" onClick={() => setDeletingId(u.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openCreate}
          className="rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-gray-300 hover:text-slate-500 transition-colors min-h-[120px]"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">{tr(lang, 'Agregar upsell', 'Add upsell')}</span>
        </button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editing ? tr(lang, 'Editar upsell', 'Edit upsell') : tr(lang, 'Nuevo upsell', 'New upsell')}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr(lang, 'Nombre', 'Name')}</FormLabel>
                  <FormControl><Input placeholder="Mat de Yoga Premium" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr(lang, 'Descripción', 'Description')}</FormLabel>
                  <FormControl><Textarea className="resize-none" rows={2} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="priceUsd" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr(lang, 'Precio (USD)', 'Price (USD)')}</FormLabel>
                  <FormControl><Input type="number" min={0} step={0.5} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    {tr(lang, 'Visible al reservar', 'Visible at booking')}
                  </FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  {tr(lang, 'Cancelar', 'Cancel')}
                </Button>
                <Button type="submit" size="sm" className="text-white" style={{ backgroundColor: TERRA }} disabled={isPending}>
                  {editing ? tr(lang, 'Guardar', 'Save') : tr(lang, 'Crear', 'Create')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr(lang, '¿Eliminar este upsell?', 'Delete this upsell?')}</AlertDialogTitle>
            <AlertDialogDescription>{tr(lang, 'Esta acción no se puede deshacer.', 'This action cannot be undone.')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr(lang, 'Cancelar', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white" onClick={() => deletingId && handleDelete(deletingId)}>
              {tr(lang, 'Eliminar', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
