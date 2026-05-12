'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import type { YogaClass } from '@/types';
import ClassModal from '@/components/admin/ClassModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toggleClassActive, deleteClass, generateWeekClasses } from '@/app/actions/classes';

const TERRA = '#c4622d';

// YogaClass with startsAt as string (serialized from Server Component)
type SerializedClass = Omit<YogaClass, 'startsAt'> & { startsAt: string };

export default function ClasesClient({ initialClasses }: { initialClasses: SerializedClass[] }) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dateFnsLocale = lang === 'es' ? es : enUS;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Convert serialized classes back for display
  const clases: YogaClass[] = initialClasses.map(c => ({ ...c, startsAt: new Date(c.startsAt) }));

  function handleToggleActive(id: string) {
    startTransition(async () => {
      await toggleClassActive(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteClass(id);
      setDeletingId(null);
      router.refresh();
    });
  }

  function handleGenerateWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    const weekStart = format(monday, 'yyyy-MM-dd');
    startTransition(async () => {
      await generateWeekClasses(weekStart);
      router.refresh();
    });
  }

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{tr(lang, 'Clases', 'Classes')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{clases.length} {tr(lang, 'clases en total', 'classes total')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleGenerateWeek}
            disabled={isPending}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
            {tr(lang, 'Generar semana', 'Generate week')}
          </Button>
          <Button
            onClick={() => { setEditingClass(undefined); setModalOpen(true); }}
            className="gap-1.5 text-xs text-white"
            style={{ backgroundColor: TERRA }}
          >
            <Plus className="w-3.5 h-3.5" />
            {tr(lang, 'Nueva clase', 'New class')}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  { key: 'clase',      label: tr(lang, 'Clase', 'Class'),          cls: '' },
                  { key: 'slug',       label: 'Slug',                               cls: 'hidden xl:table-cell' },
                  { key: 'instructor', label: tr(lang, 'Instructor', 'Instructor'), cls: 'hidden md:table-cell' },
                  { key: 'fecha',      label: tr(lang, 'Fecha y hora', 'Date & time'), cls: '' },
                  { key: 'capacidad',  label: tr(lang, 'Capacidad', 'Capacity'),    cls: '' },
                  { key: 'precio',     label: tr(lang, 'Precio', 'Price'),          cls: 'hidden lg:table-cell' },
                  { key: 'estado',     label: tr(lang, 'Estado', 'Status'),         cls: '' },
                  { key: 'acciones',   label: '',                                   cls: '' },
                ].map(({ key, label, cls }) => (
                  <th key={key} className={`text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide ${cls}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clases.map((clase) => (
                <tr key={clase.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: clase.color ?? '#94a3b8' }} />
                      <div>
                        <p className="font-medium text-slate-800">{clase.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{clase.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="font-mono text-xs text-slate-400 bg-gray-100 px-2 py-0.5 rounded">{clase.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{clase.instructor}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700 capitalize">
                      {format(clase.startsAt, lang === 'es' ? "d MMM yyyy" : "MMM d, yyyy", { locale: dateFnsLocale })}
                    </p>
                    <p className="text-xs text-slate-400">{format(clase.startsAt, "HH:mm")} · {clase.durationMinutes} min</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium text-sm ${clase.spotsRemaining === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                      {clase.spotsRemaining}/{clase.capacity}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {clase.priceUsd === 0 ? (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">{tr(lang, 'Gratis', 'Free')}</Badge>
                    ) : (
                      <span className="text-slate-600">${clase.priceUsd}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${clase.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                    >
                      {clase.isActive ? tr(lang, 'Activa', 'Active') : tr(lang, 'Inactiva', 'Inactive')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="icon"
                        className="w-7 h-7 text-slate-400 hover:text-slate-700"
                        onClick={() => handleToggleActive(clase.id)}
                        disabled={isPending}
                        title={clase.isActive ? tr(lang, 'Desactivar', 'Deactivate') : tr(lang, 'Activar', 'Activate')}
                      >
                        {clase.isActive ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="w-7 h-7 text-slate-400 hover:text-slate-700"
                        onClick={() => { setEditingClass(clase); setModalOpen(true); }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="w-7 h-7 text-slate-400 hover:text-red-500"
                        onClick={() => setDeletingId(clase.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {clases.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">
                    {tr(lang, 'Sin clases. Generá la semana o creá una manualmente.', 'No classes. Generate the week or create one manually.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClassModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={() => { setModalOpen(false); router.refresh(); }}
        classData={editingClass}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr(lang, '¿Eliminar esta clase?', 'Delete this class?')}</AlertDialogTitle>
            <AlertDialogDescription>{tr(lang, 'Esta acción no se puede deshacer.', 'This action cannot be undone.')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr(lang, 'Cancelar', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              {tr(lang, 'Eliminar', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
