'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  BookOpen,
} from 'lucide-react';
import type { YogaClass } from '@/types';
import ClassModal from '@/components/admin/ClassModal';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';
import { NativeSelect } from '@/components/admin/NativeSelect';
import {
  toggleClassActive,
  deleteClass,
  createManualClass,
  updateClassDetails,
} from '@/app/actions/classes';

type SerializedClass = Omit<YogaClass, 'startsAt'> & { startsAt: string };

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

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

// ═══════════════════════════════════════════════════════════════════════════
export default function ClasesClient({
  initialClasses,
}: {
  initialClasses: SerializedClass[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | undefined>();
  const [deletingClass, setDeletingClass] = useState<YogaClass | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Convert serialized rows back to YogaClass for rendering.
  const clases: YogaClass[] = useMemo(
    () => initialClasses.map((c) => ({ ...c, startsAt: new Date(c.startsAt) })),
    [initialClasses],
  );

  const categoryOptions = useMemo(() => {
    const present = new Set(clases.map((c) => getCategoryKey(c.name)));
    return [
      { value: 'all', label: 'All categories' },
      ...Object.entries(CATEGORY_STYLES)
        .filter(([k]) => present.has(k))
        .map(([key, val]) => ({ value: key, label: val.label })),
    ];
  }, [clases]);

  const filtered = useMemo(() => {
    const now = new Date();
    return clases.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.slug.toLowerCase().includes(q) &&
          !c.instructor.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter === 'active' && !c.isActive) return false;
      if (statusFilter === 'inactive' && c.isActive) return false;
      if (statusFilter === 'upcoming' && c.startsAt < now) return false;
      if (statusFilter === 'past' && c.startsAt >= now) return false;
      if (categoryFilter !== 'all' && getCategoryKey(c.name) !== categoryFilter) return false;
      return true;
    });
  }, [clases, search, statusFilter, categoryFilter]);

  const filtersActive = search !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
  }

  function handleToggleActive(id: string) {
    startTransition(async () => {
      await toggleClassActive(id);
      router.refresh();
    });
  }

  async function handleConfirmDelete() {
    if (!deletingClass) return;
    setIsDeleting(true);
    try {
      await deleteClass(deletingClass.id);
      setDeletingClass(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSaveClass(
    data: Omit<YogaClass, 'spotsRemaining'> & { spotsRemaining?: number },
  ) {
    startTransition(async () => {
      if (editingClass) {
        await updateClassDetails(data.id, {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          starts_at: data.startsAt.toISOString(),
          duration_minutes: data.durationMinutes,
          capacity: data.capacity,
          price_dropin_usd: data.priceUsd,
          location: data.location,
          is_active: data.isActive,
        });
      } else {
        await createManualClass({
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          starts_at: data.startsAt.toISOString(),
          duration_minutes: data.durationMinutes,
          capacity: data.capacity,
          spots_remaining: data.capacity,
          price_dropin_usd: data.priceUsd,
          location: data.location,
          is_active: data.isActive,
        });
      }
      setModalOpen(false);
      router.refresh();
    });
  }

  function openNewClass() {
    setEditingClass(undefined);
    setModalOpen(true);
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
      <PageHeader
        heading="Classes"
        description={`${clases.length} ${clases.length === 1 ? 'class' : 'classes'} total`}
        actions={
          <Button
            variant="primary"
            icon={<Plus width={16} height={16} strokeWidth={1.5} />}
            onClick={openNewClass}
          >
            New class
          </Button>
        }
      />

      {clases.length === 0 ? (
        <EmptyState
          icon={<BookOpen strokeWidth={1} />}
          heading="No classes yet"
          description="Classes appear automatically from the weekly schedule. You can also add a one-off class manually."
          action={
            <Button
              variant="primary"
              icon={<Plus width={16} height={16} strokeWidth={1.5} />}
              onClick={openNewClass}
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
                <Button variant="tertiary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ClassesTable
              clases={filtered}
              isPending={isPending}
              onToggleActive={handleToggleActive}
              onEdit={(c) => {
                setEditingClass(c);
                setModalOpen(true);
              }}
              onDelete={setDeletingClass}
            />
          )}
        </>
      )}

      <ClassModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveClass}
        classData={editingClass}
        loading={isPending}
      />

      <DeleteConfirmation
        isOpen={!!deletingClass}
        onClose={() => setDeletingClass(null)}
        onConfirm={handleConfirmDelete}
        title="Delete class?"
        description="This will permanently delete this class and all its associated bookings. This action cannot be undone."
        confirmLabel="Delete class"
        loading={isDeleting}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Table
// ═══════════════════════════════════════════════════════════════════════════
function ClassesTable({
  clases,
  isPending,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  clases: YogaClass[];
  isPending: boolean;
  onToggleActive: (id: string) => void;
  onEdit: (c: YogaClass) => void;
  onDelete: (c: YogaClass) => void;
}) {
  const headers = [
    { label: 'Class', className: '' },
    { label: 'Slug', className: 'hidden xl:table-cell' },
    { label: 'Instructor', className: 'hidden md:table-cell' },
    { label: 'Date & time', className: '' },
    { label: 'Capacity', className: '' },
    { label: 'Price', className: 'hidden lg:table-cell' },
    { label: 'Status', className: '' },
    { label: '', className: '' },
  ];

  const now = new Date();

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
            {clases.map((c) => {
              const cat = CATEGORY_STYLES[getCategoryKey(c.name)];
              const booked = c.capacity - c.spotsRemaining;
              const isPast = c.startsAt < now;
              const isFull = c.spotsRemaining === 0;
              const nearlyFull = !isFull && c.spotsRemaining / c.capacity < 0.1;

              const statusVariant: 'active' | 'warning' | 'destructive' | 'neutral' = !c.isActive
                ? 'neutral'
                : isPast
                ? 'neutral'
                : isFull
                ? 'destructive'
                : nearlyFull
                ? 'warning'
                : 'active';
              const statusLabel = !c.isActive
                ? 'Inactive'
                : isPast
                ? 'Past'
                : isFull
                ? 'Sold out'
                : 'Active';

              return (
                <tr
                  key={c.id}
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
                          {c.name}
                        </p>
                        <p className="font-body text-xs text-ink/50 mt-0.5 truncate">
                          {c.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <span className="font-mono text-xs text-ink/70 bg-cream/40 px-2 py-0.5">
                      {c.slug}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {c.instructor ? (
                      <span className="font-body text-sm text-ink/80">{c.instructor}</span>
                    ) : (
                      <span className="font-body text-sm text-ink/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-body text-sm text-ink">
                      {format(c.startsAt, 'MMM d, yyyy', { locale: enUS })}
                    </p>
                    <p className="font-body text-xs text-ink/50 mt-0.5">
                      {format(c.startsAt, 'HH:mm')} · {c.durationMinutes} min
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-body text-sm font-medium text-ink">
                      {booked}
                      <span className="text-ink/60">/{c.capacity}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="font-body text-sm font-medium text-ink">
                      {c.priceUsd === 0 ? 'Free' : `$${c.priceUsd}`}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <RowIconButton
                        ariaLabel={c.isActive ? 'Hide class' : 'Show class'}
                        onClick={() => onToggleActive(c.id)}
                        disabled={isPending}
                      >
                        {c.isActive ? (
                          <Eye width={16} height={16} strokeWidth={1.5} />
                        ) : (
                          <EyeOff width={16} height={16} strokeWidth={1.5} />
                        )}
                      </RowIconButton>
                      <RowIconButton
                        ariaLabel="Edit class"
                        onClick={() => onEdit(c)}
                      >
                        <Pencil width={16} height={16} strokeWidth={1.5} />
                      </RowIconButton>
                      <RowIconButton
                        ariaLabel="Delete class"
                        onClick={() => onDelete(c)}
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
