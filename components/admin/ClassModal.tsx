'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import type { YogaClass } from '@/types';
import { Modal } from './Modal';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Toggle } from './Toggle';
import { Field } from './Field';
import { Button } from './Button';

// Schema is validation logic — kept verbatim, error messages translated to English.
const classSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  instructor: z.string().min(1, 'Instructor is required'),
  startsAt: z.string().min(1, 'Start date and time are required'),
  durationMinutes: z.coerce.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  priceUsd: z.coerce.number().min(0, "Price can't be negative"),
  location: z.string().min(1, 'Location is required'),
  isActive: z.boolean(),
});

type ClassFormValues = z.infer<typeof classSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<YogaClass, 'spotsRemaining'> & { spotsRemaining?: number }) => void;
  classData?: YogaClass;
  loading?: boolean;
};

const DEFAULTS: ClassFormValues = {
  name: '',
  description: '',
  instructor: '',
  startsAt: '',
  durationMinutes: 60,
  capacity: 12,
  priceUsd: 25,
  location: 'Open-air shala',
  isActive: true,
};

export default function ClassModal({
  open,
  onOpenChange,
  onSave,
  classData,
  loading,
}: Props) {
  const isEditing = !!classData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: DEFAULTS,
  });

  const isActive = watch('isActive');

  useEffect(() => {
    if (!open) return;
    if (classData) {
      reset({
        name: classData.name,
        description: classData.description ?? '',
        instructor: classData.instructor,
        startsAt: format(classData.startsAt, "yyyy-MM-dd'T'HH:mm"),
        durationMinutes: classData.durationMinutes,
        capacity: classData.capacity,
        priceUsd: classData.priceUsd,
        location: classData.location,
        isActive: classData.isActive,
      });
    } else {
      reset(DEFAULTS);
    }
  }, [classData, open, reset]);

  function onSubmit(values: ClassFormValues) {
    const startsAt = new Date(values.startsAt);
    onSave({
      id: classData?.id ?? `cls-${Date.now()}`,
      slug:
        classData?.slug ??
        values.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      name: values.name,
      description: values.description ?? '',
      instructor: values.instructor,
      startsAt,
      durationMinutes: values.durationMinutes,
      capacity: values.capacity,
      spotsRemaining: classData?.spotsRemaining ?? values.capacity,
      priceUsd: values.priceUsd,
      location: values.location,
      isActive: values.isActive,
    });
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? 'Edit class' : 'New class'}
      subtitle={isEditing ? undefined : 'A single class on a specific date and time.'}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            {isEditing ? 'Save changes' : 'Create class'}
          </Button>
        </>
      }
    >
      <form id="class-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Class name"
          placeholder="Ex: Sunrise Vinyasa"
          error={errors.name?.message}
          {...register('name')}
        />

        <Textarea
          label="Description"
          placeholder="Short description of the class..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Instructor"
            placeholder="Name"
            error={errors.instructor?.message}
            {...register('instructor')}
          />
          <Input
            label="Location"
            placeholder="Open-air shala"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        <Input
          type="datetime-local"
          label="Start date & time"
          error={errors.startsAt?.message}
          {...register('startsAt')}
        />

        <div className="grid grid-cols-3 gap-6">
          <Input
            type="number"
            label="Duration (min)"
            min={15}
            max={480}
            error={errors.durationMinutes?.message}
            {...register('durationMinutes')}
          />
          <Input
            type="number"
            label="Capacity"
            min={1}
            error={errors.capacity?.message}
            {...register('capacity')}
          />
          <Input
            type="number"
            label="Price (USD)"
            min={0}
            step={5}
            error={errors.priceUsd?.message}
            {...register('priceUsd')}
          />
        </div>

        {/* Active toggle */}
        <Field
          label="Status"
          helper="Inactive classes don't appear on the public site."
        >
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-sm text-ink">
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <Toggle
              checked={isActive}
              onChange={(v) => setValue('isActive', v, { shouldDirty: true })}
              ariaLabel="Toggle active status"
            />
          </div>
        </Field>
      </form>
    </Modal>
  );
}
