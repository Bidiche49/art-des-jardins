import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { interventionSchema, type InterventionFormData } from '@/lib/validations';
import type { Chantier } from '@art-et-jardin/shared';
import type { Intervention } from '@/api';
import { format } from 'date-fns';

interface InterventionFormProps {
  intervention?: Intervention;
  chantiers: Chantier[];
  onSubmit: (data: InterventionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  preselectedChantierId?: string;
}

export function InterventionForm({
  intervention,
  chantiers,
  onSubmit,
  onCancel,
  isLoading = false,
  preselectedChantierId,
}: InterventionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterventionFormData>({
    resolver: zodResolver(interventionSchema),
    defaultValues: intervention
      ? {
          chantierId: intervention.chantierId,
          date: new Date(intervention.date),
          heureDebut: intervention.heureDebut,
          heureFin: intervention.heureFin || '',
          description: intervention.description,
          notes: intervention.notes || '',
        }
      : {
          chantierId: preselectedChantierId || '',
          date: new Date(),
          heureDebut: '08:00',
        },
  });

  const chantierOptions = chantiers.map((c) => ({
    value: c.id,
    label: `${c.adresse}, ${c.ville}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Chantier"
        options={chantierOptions}
        placeholder="Selectionner un chantier"
        error={errors.chantierId?.message}
        required
        {...register('chantierId')}
      />

      <Input
        label="Date"
        type="date"
        error={errors.date?.message}
        required
        defaultValue={intervention ? format(new Date(intervention.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
        {...register('date')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Heure de debut"
          type="time"
          error={errors.heureDebut?.message}
          required
          {...register('heureDebut')}
        />
        <Input
          label="Heure de fin"
          type="time"
          error={errors.heureFin?.message}
          {...register('heureFin')}
        />
      </div>

      <Textarea
        label="Description"
        error={errors.description?.message}
        required
        rows={3}
        placeholder="Travaux a realiser..."
        {...register('description')}
      />

      <Textarea
        label="Notes"
        error={errors.notes?.message}
        rows={2}
        {...register('notes')}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {intervention ? 'Modifier' : 'Planifier'}
        </Button>
      </div>
    </form>
  );
}
