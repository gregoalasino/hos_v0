'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import type { YogaClass } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const classSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  instructor: z.string().min(1, 'El instructor es requerido'),
  startsAt: z.string().min(1, 'La fecha y hora son requeridas'),
  durationMinutes: z.coerce.number().min(15, 'Mínimo 15 minutos').max(480, 'Máximo 8 horas'),
  capacity: z.coerce.number().min(1, 'La capacidad debe ser al menos 1'),
  priceUsd: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  location: z.string().min(1, 'La ubicación es requerida'),
  isActive: z.boolean(),
});

type ClassFormValues = z.infer<typeof classSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<YogaClass, 'spotsRemaining'> & { spotsRemaining?: number }) => void;
  classData?: YogaClass;
};

export default function ClassModal({ open, onOpenChange, onSave, classData }: Props) {
  const isEditing = !!classData;

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      description: '',
      instructor: '',
      startsAt: '',
      durationMinutes: 60,
      capacity: 12,
      priceUsd: 25,
      location: 'Open-Air Shala',
      isActive: true,
    },
  });

  useEffect(() => {
    if (classData) {
      form.reset({
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
      form.reset({
        name: '',
        description: '',
        instructor: '',
        startsAt: '',
        durationMinutes: 60,
        capacity: 12,
        priceUsd: 25,
        location: 'Open-Air Shala',
        isActive: true,
      });
    }
  }, [classData, open, form]);

  function onSubmit(values: ClassFormValues) {
    const startsAt = new Date(values.startsAt);
    onSave({
      id: classData?.id ?? `cls-${Date.now()}`,
      slug: classData?.slug ?? values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
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
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-light text-dark">
            {isEditing ? 'Editar clase' : 'Nueva clase'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la clase</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Sunrise Vinyasa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción breve de la clase..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Open-Air Shala" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startsAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y hora de inicio</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={15} max={480} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceUsd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <FormLabel className="text-sm font-medium">Clase activa</FormLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Las clases inactivas no aparecen en el sitio público
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="text-white" style={{ backgroundColor: '#c4622d' }}>
                {isEditing ? 'Guardar cambios' : 'Crear clase'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
