'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AdminTemplate } from '@/lib/queries/classes';
import type { TemplateInput } from '@/app/actions/classes';
import { Modal } from './Modal';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Toggle } from './Toggle';
import { Field } from './Field';
import { Button } from './Button';
import { NativeSelect } from './NativeSelect';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  instructorId: z.string().optional(),
  dayOfWeek: z.coerce.number().min(0).max(6),
  timeStart: z.string().min(1, 'Start time is required'),
  durationMinutes: z.coerce.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  location: z.string().min(1, 'Location is required'),
  isActive: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

const DAY_OPTIONS = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
];

const DEFAULTS: TemplateFormValues = {
  name: '',
  description: '',
  instructorId: '',
  dayOfWeek: 1,
  timeStart: '10:00',
  durationMinutes: 90,
  capacity: 20,
  location: 'Open-Air Shala',
  isActive: true,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TemplateInput) => void;
  template?: AdminTemplate;
  instructors: { id: string; name: string }[];
  loading?: boolean;
};

export default function TemplateModal({
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

  useEffect(() => {
    if (!open) return;
    if (template) {
      reset({
        name: template.name,
        description: template.description ?? '',
        instructorId: template.instructorId ?? '',
        dayOfWeek: template.dayOfWeek,
        timeStart: template.timeStart,
        durationMinutes: template.durationMinutes,
        capacity: template.capacity,
        location: template.location,
        isActive: template.isActive,
      });
    } else {
      reset(DEFAULTS);
    }
  }, [template, open, reset]);

  function onSubmit(values: TemplateFormValues) {
    onSave({
      name: values.name,
      description: values.description || null,
      instructorId: values.instructorId || null,
      dayOfWeek: values.dayOfWeek,
      timeStart: values.timeStart,
      durationMinutes: values.durationMinutes,
      capacity: values.capacity,
      location: values.location,
      isActive: values.isActive,
    });
  }

  const instructorOptions = [
    { value: '', label: 'No instructor' },
    ...instructors.map((i) => ({ value: i.id, label: i.name })),
  ];

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? 'Edit recurring class' : 'New recurring class'}
      subtitle={
        isEditing ? undefined : 'A weekly class that repeats every week on the chosen day and time.'
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
      <form id="template-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Class name"
          placeholder="Ex: Detox Yoga"
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
          <NativeSelect label="Instructor" options={instructorOptions} {...register('instructorId')} />
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

        <div className="grid grid-cols-2 gap-6">
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
        </div>

        <Field label="Status" helper="Inactive classes don't appear on the public calendar.">
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-sm text-ink">{isActive ? 'Active' : 'Inactive'}</span>
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
