'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, Check, X as XIcon } from 'lucide-react';
import type { Instructor } from '@/types';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { DeleteConfirmation } from './DeleteConfirmation';
import { RowIconButton } from '@/app/admin/clases/_components/ClasesClient';
import {
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '@/app/actions/instructors';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructors: Instructor[];
  onChanged: () => void; // parent refreshes the server data
};

type Draft = { name: string; email: string };
const EMPTY_DRAFT: Draft = { name: '', email: '' };

export default function InstructorModal({
  open,
  onOpenChange,
  instructors,
  onChanged,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Instructor | null>(null);

  function resetForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setError(null);
  }

  function startAdd() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setError(null);
    setFormOpen(true);
  }

  function startEdit(i: Instructor) {
    setEditingId(i.id);
    setDraft({ name: i.name, email: i.email ?? '' });
    setError(null);
    setFormOpen(true);
  }

  function handleSubmit() {
    const name = draft.name.trim();
    if (!name) {
      setError('Name is required.');
      return;
    }
    const payload = { name, email: draft.email.trim() || null };
    startTransition(async () => {
      const res = editingId
        ? await updateInstructor(editingId, payload)
        : await createInstructor(payload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      resetForm();
      onChanged();
    });
  }

  function handleConfirmDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const res = await deleteInstructor(deleting.id);
      if (!res.ok) {
        setError(res.error);
        setDeleting(null);
        return;
      }
      setDeleting(null);
      onChanged();
    });
  }

  return (
    <>
      <Modal
        isOpen={open}
        onClose={() => {
          resetForm();
          onOpenChange(false);
        }}
        title="Instructors"
        subtitle="Manage the yoga instructors available for your classes."
        maxWidth="max-w-lg"
        footer={
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Done
          </Button>
        }
      >
        {/* Global error (e.g. delete blocked because instructor is in use) */}
        {error && !formOpen && (
          <p className="font-body text-xs italic text-burgundy mb-4">{error}</p>
        )}

        {/* List */}
        {instructors.length === 0 ? (
          <p className="font-body text-sm text-ink/50 py-2">No instructors yet.</p>
        ) : (
          <ul className="divide-y divide-ink/[0.08] border-t border-ink/10">
            {instructors.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-medium text-ink truncate">{i.name}</p>
                  {i.email && (
                    <p className="font-body text-xs text-ink/50 truncate mt-0.5">{i.email}</p>
                  )}
                </div>
                <RowIconButton ariaLabel="Edit instructor" onClick={() => startEdit(i)} disabled={isPending}>
                  <Pencil width={16} height={16} strokeWidth={1.5} />
                </RowIconButton>
                <RowIconButton
                  ariaLabel="Delete instructor"
                  onClick={() => {
                    setError(null);
                    setDeleting(i);
                  }}
                  disabled={isPending}
                  hoverDestructive
                >
                  <Trash2 width={16} height={16} strokeWidth={1.5} />
                </RowIconButton>
              </li>
            ))}
          </ul>
        )}

        {/* Inline add/edit form */}
        {formOpen ? (
          <div className="mt-6 pt-6 border-t border-ink/10 space-y-4">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink/60">
              {editingId ? 'Edit instructor' : 'New instructor'}
            </p>
            <Input
              label="Name"
              placeholder="Ex: Nancy Goodfellow"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              error={error ?? undefined}
            />
            <Input
              label="Email (optional)"
              type="email"
              placeholder="nancy@houseofshakti.com"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                icon={<Check width={16} height={16} strokeWidth={1.5} />}
                onClick={handleSubmit}
                loading={isPending}
              >
                {editingId ? 'Save' : 'Add'}
              </Button>
              <Button
                variant="tertiary"
                icon={<XIcon width={16} height={16} strokeWidth={1.5} />}
                onClick={resetForm}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-ink/10">
            <Button
              variant="secondary"
              icon={<Plus width={16} height={16} strokeWidth={1.5} />}
              onClick={startAdd}
              disabled={isPending}
            >
              Add instructor
            </Button>
          </div>
        )}
      </Modal>

      <DeleteConfirmation
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
        title="Delete instructor?"
        description={`This will permanently delete ${deleting?.name ?? 'this instructor'}. This action cannot be undone.`}
        confirmLabel="Delete instructor"
        loading={isPending}
      />
    </>
  );
}
