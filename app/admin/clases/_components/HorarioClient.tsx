'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, EyeOff, CalendarDays, Clock } from 'lucide-react';
import type { AdminTemplate } from '@/lib/queries/classes';
import type { TemplateInput } from '@/app/actions/classes';
import TemplateModal from '@/components/admin/TemplateModal';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';
import {
  createTemplate,
  updateTemplate,
  toggleTemplateActive,
  deleteTemplate,
} from '@/app/actions/classes';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Display order Mon→Sun.
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function HorarioClient({
  templates,
  instructors,
}: {
  templates: AdminTemplate[];
  instructors: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTemplate | undefined>();
  const [deleting, setDeleting] = useState<AdminTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ordered = [...templates].sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek) ||
      a.timeStart.localeCompare(b.timeStart),
  );

  const activeCount = templates.filter((t) => t.isActive).length;

  function openNew() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function handleSave(data: TemplateInput) {
    startTransition(async () => {
      if (editing) {
        await updateTemplate(editing.id, data);
      } else {
        await createTemplate(data);
      }
      setModalOpen(false);
      router.refresh();
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleTemplateActive(id);
      router.refresh();
    });
  }

  async function handleConfirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteTemplate(deleting.id);
      setDeleting(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-5xl mx-auto">
      <PageHeader
        heading="Weekly schedule"
        description={`${activeCount} recurring ${activeCount === 1 ? 'class' : 'classes'} · shown automatically on the public calendar every week`}
        actions={
          <Button
            variant="primary"
            icon={<Plus width={16} height={16} strokeWidth={1.5} />}
            onClick={openNew}
          >
            New recurring class
          </Button>
        }
      />

      {ordered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays strokeWidth={1} />}
          heading="No recurring classes yet"
          description="Add the weekly classes here. They appear automatically on the public calendar every week — no need to generate anything."
          action={
            <Button
              variant="primary"
              icon={<Plus width={16} height={16} strokeWidth={1.5} />}
              onClick={openNew}
            >
              New recurring class
            </Button>
          }
        />
      ) : (
        <div className="bg-white border border-ink/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-warm-white border-b border-ink/10">
                  {['Day', 'Time', 'Class', 'Instructor', 'Capacity', 'Status', ''].map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase font-medium text-ink/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordered.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-ink/[0.08] last:border-0 hover:bg-cream/40 transition-colors duration-200"
                  >
                    <td className="px-4 py-4">
                      <span className="font-body text-sm font-medium text-ink">
                        {DAY_NAMES[t.dayOfWeek]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 font-body text-sm text-ink/80">
                        <Clock width={14} height={14} strokeWidth={1.5} className="text-ink/40" />
                        {t.timeStart}
                        <span className="text-ink/40">· {t.durationMinutes}m</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-body text-sm font-medium text-ink">{t.name}</p>
                      <p className="font-body text-xs text-ink/50 mt-0.5">{t.location}</p>
                    </td>
                    <td className="px-4 py-4">
                      {t.instructorName ? (
                        <span className="font-body text-sm text-ink/80">{t.instructorName}</span>
                      ) : (
                        <span className="font-body text-sm text-ink/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-body text-sm text-ink">{t.capacity}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={t.isActive ? 'active' : 'neutral'}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <RowIconButton
                          ariaLabel={t.isActive ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggle(t.id)}
                          disabled={isPending}
                        >
                          {t.isActive ? (
                            <Eye width={16} height={16} strokeWidth={1.5} />
                          ) : (
                            <EyeOff width={16} height={16} strokeWidth={1.5} />
                          )}
                        </RowIconButton>
                        <RowIconButton
                          ariaLabel="Edit"
                          onClick={() => {
                            setEditing(t);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil width={16} height={16} strokeWidth={1.5} />
                        </RowIconButton>
                        <RowIconButton
                          ariaLabel="Delete"
                          onClick={() => setDeleting(t)}
                          hoverDestructive
                        >
                          <Trash2 width={16} height={16} strokeWidth={1.5} />
                        </RowIconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TemplateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        template={editing}
        instructors={instructors}
        loading={isPending}
      />

      <DeleteConfirmation
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
        title="Delete recurring class?"
        description="This removes it from the weekly schedule. Classes already booked for specific dates are not affected."
        confirmLabel="Delete"
        loading={isDeleting}
      />
    </div>
  );
}

function RowIconButton({
  children,
  onClick,
  ariaLabel,
  disabled,
  hoverDestructive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
  hoverDestructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`
        w-8 h-8 p-1.5 inline-flex items-center justify-center
        text-ink/60 hover:bg-cream/40
        ${hoverDestructive ? 'hover:text-burgundy' : 'hover:text-ink'}
        transition-colors duration-200 cursor-pointer
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
}
