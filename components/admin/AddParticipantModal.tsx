'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Check } from 'lucide-react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Field } from './Field';
import { NativeSelect } from './NativeSelect';
import { Toggle } from './Toggle';
import { Button } from './Button';

// Admin quick-add for a walk-in participant. Mirrors the public booking form's
// personal fields (name, email, phone, hotel guest + Cloudbeds ref) so a
// manually-added student looks just like a web booking — but skips the multi-
// step upsell/pack flow: it's an express add for someone standing at reception.
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  persons: z.coerce.number().min(1, 'At least 1').max(20, 'Too many'),
  paymentMethod: z.enum(['cash', 'venmo', 'card']),
  markPaid: z.boolean(),
  isHotelGuest: z.boolean(),
  cloudbedsRef: z.string().optional(),
});

export type UpsellOption = { id: string; name: string; priceUsd: number };

// Upsell selection lives outside the zod schema (it's a simple id list managed
// with local state), so the submitted payload merges the two.
export type AddParticipantValues = z.infer<typeof schema> & { upsellIds: string[] };

const DEFAULTS: z.infer<typeof schema> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  persons: 1,
  paymentMethod: 'cash',
  markPaid: true,
  isHotelGuest: false,
  cloudbedsRef: '',
};

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'card', label: 'Card' },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddParticipantValues) => void;
  className: string;
  spotsRemaining: number;
  priceUsd: number;
  upsells: UpsellOption[];
  loading?: boolean;
  error?: string | null;
};

export default function AddParticipantModal({
  open,
  onOpenChange,
  onSubmit,
  className,
  spotsRemaining,
  priceUsd,
  upsells,
  loading,
  error,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });

  // Upsell selection — a plain id list, merged into the payload on submit.
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);

  const isHotelGuest = watch('isHotelGuest');
  const markPaid = watch('markPaid');
  const persons = watch('persons');

  // Reset the form + upsell selection each time the modal opens.
  useEffect(() => {
    if (open) {
      reset(DEFAULTS);
      setSelectedUpsells([]);
    }
  }, [open, reset]);

  function toggleUpsell(id: string) {
    setSelectedUpsells((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const upsellsTotal = useMemo(
    () =>
      upsells
        .filter((u) => selectedUpsells.includes(u.id))
        .reduce((acc, u) => acc + u.priceUsd, 0),
    [upsells, selectedUpsells],
  );

  const total = priceUsd * (Number(persons) || 1) + upsellsTotal;

  const submit = handleSubmit((values) =>
    onSubmit({ ...values, upsellIds: selectedUpsells }),
  );

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Add participant"
      subtitle={`Manually register a student on ${className}. ${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} left.`}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={submit} loading={loading}>
            Add participant
          </Button>
        </>
      }
    >
      <form id="add-participant-form" onSubmit={submit} className="space-y-6">
        {error && (
          <div className="flex items-start gap-2 bg-burgundy/5 border border-burgundy/20 px-4 py-3">
            <AlertCircle
              width={16}
              height={16}
              strokeWidth={1.5}
              className="text-burgundy flex-shrink-0 mt-0.5"
            />
            <p className="font-body text-sm text-burgundy">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="First name"
            placeholder="Ada"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            placeholder="Lovelace"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          type="email"
          label="Email"
          placeholder="student@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-6">
          <Input
            type="tel"
            label="Phone (optional)"
            placeholder="+506 …"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            type="number"
            label="People"
            min={1}
            max={20}
            error={errors.persons?.message}
            {...register('persons')}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <NativeSelect
            label="Payment method"
            options={PAYMENT_OPTIONS}
            error={errors.paymentMethod?.message}
            {...register('paymentMethod')}
          />
          <Field
            label="Already paid"
            helper={markPaid ? 'Recorded as paid.' : 'Left pending — shows in the sidebar badge.'}
          >
            <div className="flex items-center justify-between mt-2">
              <span className="font-body text-sm text-ink">{markPaid ? 'Paid' : 'Pending'}</span>
              <Toggle
                checked={markPaid}
                onChange={(v) => setValue('markPaid', v, { shouldDirty: true })}
                ariaLabel="Toggle paid status"
              />
            </div>
          </Field>
        </div>

        <Field label="Hotel guest" helper="Guests staying at the hotel.">
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-sm text-ink">{isHotelGuest ? 'Yes' : 'No'}</span>
            <Toggle
              checked={isHotelGuest}
              onChange={(v) => setValue('isHotelGuest', v, { shouldDirty: true })}
              ariaLabel="Toggle hotel guest"
            />
          </div>
        </Field>

        {isHotelGuest && (
          <Input
            label="Cloudbeds reference (optional)"
            placeholder="Reservation #"
            error={errors.cloudbedsRef?.message}
            {...register('cloudbedsRef')}
          />
        )}

        {upsells.length > 0 && (
          <Field label="Extras" helper="Optional add-ons, charged on top of the class.">
            <div className="mt-2 space-y-2">
              {upsells.map((u) => {
                const checked = selectedUpsells.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleUpsell(u.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 border text-left transition-colors duration-200 cursor-pointer ${
                      checked
                        ? 'border-burgundy bg-burgundy/5'
                        : 'border-ink/15 hover:border-ink/30'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span
                        aria-hidden
                        className={`flex items-center justify-center w-4 h-4 flex-shrink-0 border ${
                          checked ? 'bg-burgundy border-burgundy text-cream' : 'border-ink/30'
                        }`}
                      >
                        {checked && <Check width={12} height={12} strokeWidth={2} />}
                      </span>
                      <span className="font-body text-sm text-ink truncate">{u.name}</span>
                    </span>
                    <span className="font-body text-sm text-ink/70 flex-shrink-0">
                      +${u.priceUsd}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        {total > 0 && (
          <div className="flex justify-between items-center bg-neutral-50 px-4 py-3">
            <span className="font-body text-sm text-ink/60">Total</span>
            <span className="font-body text-base font-medium text-ink">${total} USD</span>
          </div>
        )}
      </form>
    </Modal>
  );
}
