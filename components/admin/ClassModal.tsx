'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ClassTemplate, Instructor } from '@/types';
import { Modal } from './Modal';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Toggle } from './Toggle';
import { Field } from './Field';
import { NativeSelect } from './NativeSelect';
import { Button } from './Button';
import { ImageUpload } from './ImageUpload';

// Day-of-week options (0=Sun … 6=Sat, matching class_templates.day_of_week).
export const DAY_OPTIONS = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
];

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  instructorId: z.string(), // '' means unassigned
  dayOfWeek: z.coerce.number().min(0).max(6),
  timeStart: z.string().min(1, 'Time is required'),
  durationMinutes: z.coerce.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  priceUsd: z.coerce.number().min(0, "Price can't be negative"),
  location: z.string().min(1, 'Location is required'),
  isActive: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export type TemplatePayload = {
  name: string;
  slug: string;
  description: string | null;
  instructor_id: string | null;
  day_of_week: number;
  time_start: string;
  duration_minutes: number;
  capacity: number;
  price_dropin_usd: number;
  location: string;
  image_url: string | null;
  is_active: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TemplatePayload) => void;
  template?: ClassTemplate;
  instructors: Instructor[];
  loading?: boolean;
};

const DEFAULTS: TemplateFormValues = {
  name: '',
  description: '',
  instructorId: '',
  dayOfWeek: 1,
  timeStart: '10:00',
  durationMinutes: 90,
  capacity: 20,
  priceUsd: 20,
  location: 'Open-Air Shala',
  isActive: true,
};

export default function ClassModal({
  open,
  onOpenChange,
  onSave,
  template,
  instructors,
  loading,
}: Props) {
  const isEditing = !!template;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: DEFAULTS,
  });

  const isActive = watch('isActive');

  // Image URL is managed outside RHF (uploaded via the ImageUpload widget).
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setImageUrl(template?.image_url ?? null);
    if (template) {
      reset({
        name: template.name,
        description: template.description ?? '',
        instructorId: template.instructor_id ?? '',
        dayOfWeek: template.day_of_week,
        timeStart: (template.time_start ?? '10:00').slice(0, 5),
        durationMinutes: template.duration_minutes,
        capacity: template.capacity,
        priceUsd: template.price_dropin_usd,
        location: template.location,
        isActive: template.is_active,
      });
    } else {
      reset(DEFAULTS);
    }
  }, [template, open, reset]);

  function onSubmit(values: TemplateFormValues) {
    onSave({
      name: values.name,
      slug:
        template?.slug ??
        values.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      description: values.description?.trim() ? values.description : null,
      instructor_id: values.instructorId || null,
      day_of_week: values.dayOfWeek,
      time_start: values.timeStart,
      duration_minutes: values.durationMinutes,
      capacity: values.capacity,
      price_dropin_usd: values.priceUsd,
      location: values.location,
      image_url: imageUrl,
      is_active: values.isActive,
    });
  }

  const instructorOptions = [
    { value: '', label: 'Unassigned' },
    ...instructors.map((i) => ({ value: i.id, label: i.name })),
  ];

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? 'Edit recurring class' : 'New recurring class'}
      subtitle={
        isEditing
          ? undefined
          : 'A class that repeats every week on the chosen day and time.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit(onSubmit)} loading={loading}>
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

        <ImageUpload value={imageUrl} onChange={setImageUrl} />

        <div className="grid grid-cols-2 gap-6">
          <NativeSelect
            label="Instructor"
            options={instructorOptions}
            error={errors.instructorId?.message}
            {...register('instructorId')}
          />
          <Input
            label="Location"
            placeholder="Open-Air Shala"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <NativeSelect
            label="Day of week"
            options={DAY_OPTIONS}
            error={errors.dayOfWeek?.message}
            {...register('dayOfWeek')}
          />
          <Input
            type="time"
            label="Start time"
            error={errors.timeStart?.message}
            {...register('timeStart')}
          />
        </div>

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

        <Field label="Status" helper="Inactive classes don't appear on the public site or generate new sessions.">
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
