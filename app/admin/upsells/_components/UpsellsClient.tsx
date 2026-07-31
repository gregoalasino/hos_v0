'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import type { Upsell } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';
import { Modal } from '@/components/admin/Modal';
import { Input } from '@/components/admin/Input';
import { Textarea } from '@/components/admin/Textarea';
import { Toggle } from '@/components/admin/Toggle';
import { Field } from '@/components/admin/Field';
import {
  createUpsell,
  updateUpsell,
  toggleUpsellActive,
  deleteUpsell,
} from '@/app/actions/upsells';

const upsellSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  priceUsd: z.coerce.number().min(0, "Price can't be negative"),
  isActive: z.boolean(),
});
type UpsellForm = z.infer<typeof upsellSchema>;

const DEFAULTS: UpsellForm = {
  name: '',
  description: '',
  priceUsd: 0,
  isActive: true,
};

// ═══════════════════════════════════════════════════════════════════════════
export default function UpsellsClient({
  initialUpsells,
}: {
  initialUpsells: Upsell[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Upsell | undefined>();
  const [deleting, setDeleting] = useState<Upsell | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpsellForm>({
    resolver: zodResolver(upsellSchema),
    defaultValues: DEFAULTS,
  });

  const isActive = watch('isActive');

  function openCreate() {
    setEditing(undefined);
    reset(DEFAULTS);
    setModalOpen(true);
  }

  function openEdit(u: Upsell) {
    setEditing(u);
    reset({
      name: u.name,
      description: u.description,
      priceUsd: u.priceUsd,
      isActive: u.isActive,
    });
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

  async function handleConfirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteUpsell(deleting.id);
      setDeleting(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-5xl mx-auto">
      <PageHeader
        heading="Upsells"
        description="Additional products and services available at booking."
        actions={
          <Button
            variant="primary"
            icon={<Plus width={16} height={16} strokeWidth={1.5} />}
            onClick={openCreate}
          >
            New upsell
          </Button>
        }
      />

      {initialUpsells.length === 0 && (
        <EmptyState
          icon={<Tag strokeWidth={1} />}
          heading="No upsells configured"
          description="Create your first upsell to offer extras during booking."
          action={
            <Button
              variant="primary"
              icon={<Plus width={16} height={16} strokeWidth={1.5} />}
              onClick={openCreate}
            >
              New upsell
            </Button>
          }
        />
      )}

      {initialUpsells.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialUpsells.map((u) => (
            <Card key={u.id}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-body text-base font-medium text-ink leading-tight">
                      {u.name}
                    </h3>
                    <Badge variant={u.isActive ? 'active' : 'inactive'}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <span className="font-body text-base font-medium text-ink flex-shrink-0">
                  ${u.priceUsd}
                </span>
              </div>

              <p className="font-body text-sm text-ink/60 leading-normal mt-2 line-clamp-2">
                {u.description}
              </p>

              <div className="mt-6 pt-4 border-t border-ink/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={u.isActive}
                    onChange={() => handleToggle(u.id)}
                    disabled={isPending}
                    ariaLabel={u.isActive ? 'Hide upsell' : 'Show upsell'}
                  />
                  <span className="font-body text-xs text-ink/60">
                    {u.isActive ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(u)}
                    aria-label="Edit upsell"
                    className="w-8 h-8 p-1.5 inline-flex items-center justify-center text-ink/60 hover:bg-neutral-50 hover:text-ink transition-colors duration-200 cursor-pointer"
                  >
                    <Pencil width={16} height={16} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(u)}
                    aria-label="Delete upsell"
                    className="w-8 h-8 p-1.5 inline-flex items-center justify-center text-ink/60 hover:bg-neutral-50 hover:text-burgundy transition-colors duration-200 cursor-pointer"
                  >
                    <Trash2 width={16} height={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {/* Add card — empty placeholder. Doubles as the EmptyState CTA. */}
          <button
            type="button"
            onClick={openCreate}
            className="border-2 border-dashed border-ink/15 p-6 flex flex-col items-center justify-center min-h-[180px] hover:border-ink/30 transition-colors duration-200 cursor-pointer text-ink/40 hover:text-ink/60"
          >
            <Plus width={24} height={24} strokeWidth={1} />
            <span className="font-body text-sm mt-3">Add upsell</span>
          </button>
        </div>
      )}

      {/* ─── Modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit upsell' : 'New upsell'}
        subtitle={editing ? undefined : 'A single add-on offered at booking.'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              loading={isPending}
            >
              {editing ? 'Save changes' : 'Create upsell'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Name"
            placeholder="Premium yoga mat"
            error={errors.name?.message}
            {...register('name')}
          />
          <Textarea
            label="Description"
            placeholder="Short description shown at booking..."
            rows={2}
            error={errors.description?.message}
            {...register('description')}
          />
          <Input
            type="number"
            label="Price (USD)"
            min={0}
            step={0.5}
            error={errors.priceUsd?.message}
            {...register('priceUsd')}
          />
          <Field
            label="Visibility"
            helper="Hidden upsells don't appear on the booking flow."
          >
            <div className="flex items-center justify-between mt-2">
              <span className="font-body text-sm text-ink">
                {isActive ? 'Visible at booking' : 'Hidden'}
              </span>
              <Toggle
                checked={isActive}
                onChange={(v) => setValue('isActive', v, { shouldDirty: true })}
                ariaLabel="Toggle visibility"
              />
            </div>
          </Field>
        </form>
      </Modal>

      <DeleteConfirmation
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
        title="Delete upsell?"
        description="This will remove this upsell from future bookings."
        confirmLabel="Delete upsell"
        loading={isDeleting}
      />
    </div>
  );
}
