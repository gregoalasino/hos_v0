'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  BookOpen,
  Users,
} from 'lucide-react';
import type { ClassTemplate, Instructor } from '@/types';
import ClassModal, { type TemplatePayload } from '@/components/admin/ClassModal';
import InstructorModal from '@/components/admin/InstructorModal';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';
import { NativeSelect } from '@/components/admin/NativeSelect';
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateActive,
} from '@/app/actions/classes';

// ─── Category palette — mirrors /yoga and /admin/calendario ────────────────
const CATEGORY_STYLES: Record<string, { stripe: string; label: string }> = {
  'flow-vinyasa':     { stripe: '#8B6F47', label: 'Vinyasa' },
  'yin-restorative':  { stripe: '#6B7355', label: 'Yin & Restorative' },
  'hatha-gentle':     { stripe: '#A6896D', label: 'Hatha' },
  'ashtanga-intense': { stripe: '#5A3E2B', label: 'Ashtanga' },
  'meditation':       { stripe: '#7A6B5D', label: 'Meditation' },
};

function getCategoryKey(name: string): string {
  if (['Sunrise Vinyasa', 'Power Flow', 'Breath & Movement', 'Vinyasa Flow', 'Vinyasa Krama', 'Detox Yoga'].includes(name)) return 'flow-vinyasa';
  if (['Yin Yoga', 'Yin & Restore', 'Restorative Yoga', 'Deep Stretch & Breath'].includes(name)) return 'yin-restorative';
  if (['Gentle Flow', 'Hatha Foundations'].includes(name)) return 'hatha-gentle';
  if (['Ashtanga Primary'].includes(name)) return 'ashtanga-intense';
  if (['Pranayama & Meditación', 'Meditation', 'Tantra Vinyasa'].includes(name)) return 'meditation';
  return 'flow-vinyasa';
}

// day_of_week (0=Sun … 6=Sat) → "Every <Day>"
const DAY_NAMES = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// ═══════════════════════════════════════════════════════════════════════════
export default function ClasesClient({
  initialTemplates,
  instructors,
}: {
  initialTemplates: ClassTemplate[];
  instructors: Instructor[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ClassTemplate | undefined>();
  const [deletingTemplate, setDeletingTemplate] = useState<ClassTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [instructorModalOpen, setInstructorModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const templates = initialTemplates;

  function instructorName(t: ClassTemplate): string {
    return (
      t.instructors?.name ??
      instructors.find((i) => i.id === t.instructor_id)?.name ??
      ''
    );
  }

  const categoryOptions = useMemo(() => {
    const present = new Set(templates.map((t) => getCategoryKey(t.name)));
    return [
      { value: 'all', label: 'All categories' },
      ...Object.entries(CATEGORY_STYLES)
        .filter(([k]) => present.has(k))
        .map(([key, val]) => ({ value: key, label: val.label })),
    ];
  }, [templates]);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.slug.toLowerCase().includes(q) &&
          !instructorName(t).toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter === 'active' && !t.is_active) return false;
      if (statusFilter === 'inactive' && t.is_active) return false;
      if (categoryFilter !== 'all' && getCategoryKey(t.name) !== categoryFilter) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, search, statusFilter, categoryFilter]);

  const filtersActive = search !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
  }

  function handleToggleActive(id: string) {
    startTransition(async () => {
      await toggleTemplateActive(id);
      router.refresh();
    });
  }

  async function handleConfirmDelete() {
    if (!deletingTemplate) return;
    setIsDeleting(true);
    try {
      await deleteTemplate(deletingTemplate.id);
      setDeletingTemplate(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSaveTemplate(data: TemplatePayload) {
    startTransition(async () => {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, data);
      } else {
        await createTemplate(data);
      }
      setModalOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
      <PageHeader
        heading="Classes"
        description={`Weekly recurring schedule · ${templates.length} ${templates.length === 1 ? 'class' : 'classes'}`}
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Users width={16} height={16} strokeWidth={1.5} />}
              onClick={() => setInstructorModalOpen(true)}
            >
              Manage instructors
            </Button>
            <Button
              variant="primary"
              icon={<Plus width={16} height={16} strokeWidth={1.5} />}
              onClick={() => {
                setEditingTemplate(undefined);
                setModalOpen(true);
              }}
            >
              New class
            </Button>
          </>
        }
      />

      {templates.length === 0 ? (
        <EmptyState
          icon={<BookOpen strokeWidth={1} />}
          heading="No classes yet"
          description="Create your first recurring class to build the weekly schedule."
          action={
            <Button
              variant="primary"
              icon={<Plus width={16} height={16} strokeWidth={1.5} />}
              onClick={() => {
                setEditingTemplate(undefined);
                setModalOpen(true);
              }}
            >
              New class
            </Button>
          }
        />
      ) : (
        <>
          {/* ─── Filters bar ──────────────────────────────────────────── */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="relative md:w-64">
              <Search
                aria-hidden
                className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/40"
                width={16}
                height={16}
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, slug, or instructor..."
                className="w-full pl-7 pb-2 border-b border-ink/20 bg-transparent font-body text-sm text-ink outline-none focus:border-ink transition-colors duration-200 placeholder:text-ink/30 placeholder:italic"
              />
            </div>
            <NativeSelect
              filter
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_OPTIONS}
              aria-label="Filter by status"
            />
            <NativeSelect
              filter
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
              aria-label="Filter by category"
            />
          </div>

          {/* ─── Table ────────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search strokeWidth={1} />}
              heading="No classes match your filters"
              description="Try clearing the filters or creating a new class."
              action={
                filtersActive ? (
                  <Button variant="tertiary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <TemplatesTable
              templates={filtered}
              instructorName={instructorName}
              isPending={isPending}
              onToggleActive={handleToggleActive}
              onEdit={(t) => {
                setEditingTemplate(t);
                setModalOpen(true);
              }}
              onDelete={setDeletingTemplate}
            />
          )}
        </>
      )}

      <ClassModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveTemplate}
        template={editingTemplate}
        instructors={instructors}
        loading={isPending}
      />

      <InstructorModal
        open={instructorModalOpen}
        onOpenChange={setInstructorModalOpen}
        instructors={instructors}
        onChanged={() => router.refresh()}
      />

      <DeleteConfirmation
        isOpen={!!deletingTemplate}
        onClose={() => setDeletingTemplate(null)}
        onConfirm={handleConfirmDelete}
        title="Delete class?"
        description="This removes the recurring class and its upcoming sessions. Past sessions and their bookings are kept. This action cannot be undone."
        confirmLabel="Delete class"
        loading={isDeleting}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Table
// ═══════════════════════════════════════════════════════════════════════════
function TemplatesTable({
  templates,
  instructorName,
  isPending,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  templates: ClassTemplate[];
  instructorName: (t: ClassTemplate) => string;
  isPending: boolean;
  onToggleActive: (id: string) => void;
  onEdit: (t: ClassTemplate) => void;
  onDelete: (t: ClassTemplate) => void;
}) {
  const headers = [
    { label: 'Class', className: '' },
    { label: 'Slug', className: 'hidden xl:table-cell' },
    { label: 'Instructor', className: 'hidden md:table-cell' },
    { label: 'Schedule', className: '' },
    { label: 'Capacity', className: '' },
    { label: 'Price', className: 'hidden lg:table-cell' },
    { label: 'Status', className: '' },
    { label: '', className: '' },
  ];

  return (
    <div className="bg-white border border-ink/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-warm-white border-b border-ink/10">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`text-left px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase font-medium text-ink/50 ${h.className}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => {
              const cat = CATEGORY_STYLES[getCategoryKey(t.name)];
              const name = instructorName(t);
              const time = (t.time_start ?? '').slice(0, 5);

              return (
                <tr
                  key={t.id}
                  className="border-b border-ink/[0.08] last:border-0 hover:bg-cream/40 transition-colors duration-200"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                        style={{ background: cat.stripe }}
                      />
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium text-ink truncate">
                          {t.name}
                        </p>
                        <p className="font-body text-xs text-ink/50 mt-0.5 truncate">
                          {t.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <span className="font-mono text-xs text-ink/70 bg-cream/40 px-2 py-0.5">
                      {t.slug}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {name ? (
                      <span className="font-body text-sm text-ink/80">{name}</span>
                    ) : (
                      <span className="font-body text-sm text-ink/30">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-body text-sm text-ink">
                      Every {DAY_NAMES[t.day_of_week]} · {time}
                    </p>
                    <p className="font-body text-xs text-ink/50 mt-0.5">
                      {t.duration_minutes} min
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-body text-sm font-medium text-ink">
                      {t.capacity}
                      <span className="text-ink/60"> seats</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="font-body text-sm font-medium text-ink">
                      {t.price_dropin_usd == null
                        ? '—'
                        : t.price_dropin_usd === 0
                        ? 'Free'
                        : `$${t.price_dropin_usd}`}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={t.is_active ? 'active' : 'neutral'}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <RowIconButton
                        ariaLabel={t.is_active ? 'Deactivate class' : 'Activate class'}
                        onClick={() => onToggleActive(t.id)}
                        disabled={isPending}
                      >
                        {t.is_active ? (
                          <Eye width={16} height={16} strokeWidth={1.5} />
                        ) : (
                          <EyeOff width={16} height={16} strokeWidth={1.5} />
                        )}
                      </RowIconButton>
                      <RowIconButton ariaLabel="Edit class" onClick={() => onEdit(t)}>
                        <Pencil width={16} height={16} strokeWidth={1.5} />
                      </RowIconButton>
                      <RowIconButton
                        ariaLabel="Delete class"
                        onClick={() => onDelete(t)}
                        hoverDestructive
                      >
                        <Trash2 width={16} height={16} strokeWidth={1.5} />
                      </RowIconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Reusable row action button — consistent across all admin tables.
export function RowIconButton({
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
