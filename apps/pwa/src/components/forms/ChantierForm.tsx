import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { chantierSchema, type ChantierFormData, TYPES_PRESTATION } from '@/lib/validations';
import type { Chantier, Client } from '@art-et-jardin/shared';

interface ChantierFormProps {
  chantier?: Chantier;
  clients: Client[];
  onSubmit: (data: ChantierFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ChantierForm({
  chantier,
  clients,
  onSubmit,
  onCancel,
  isLoading = false,
}: ChantierFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChantierFormData>({
    resolver: zodResolver(chantierSchema),
    defaultValues: chantier
      ? {
          clientId: chantier.clientId,
          adresse: chantier.adresse,
          codePostal: chantier.codePostal,
          ville: chantier.ville,
          typePrestation: chantier.typePrestation,
          description: chantier.description,
          surface: chantier.surface,
          dateVisite: chantier.dateVisite,
          notes: chantier.notes || '',
        }
      : {
          typePrestation: [],
        },
  });

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: c.type === 'particulier' ? `${c.prenom} ${c.nom}` : c.raisonSociale || c.nom,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Client"
        options={clientOptions}
        placeholder="Selectionner un client"
        error={errors.clientId?.message}
        required
        {...register('clientId')}
      />

      <Input
        label="Adresse du chantier"
        error={errors.adresse?.message}
        required
        {...register('adresse')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Code postal"
          error={errors.codePostal?.message}
          required
          maxLength={5}
          {...register('codePostal')}
        />
        <Input
          label="Ville"
          error={errors.ville?.message}
          required
          {...register('ville')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de prestation <span className="text-red-500">*</span>
        </label>
        <Controller
          name="typePrestation"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {TYPES_PRESTATION.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={field.value?.includes(type.value as never)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), type.value]
                        : field.value?.filter((v) => v !== type.value) || [];
                      field.onChange(newValue);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.typePrestation && (
          <p className="mt-1 text-sm text-red-600">{errors.typePrestation.message}</p>
        )}
      </div>

      <Textarea
        label="Description"
        error={errors.description?.message}
        required
        rows={3}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Surface (m2)"
          type="number"
          step="0.01"
          error={errors.surface?.message}
          {...register('surface', { valueAsNumber: true })}
        />
        <Input
          label="Date de visite"
          type="date"
          error={errors.dateVisite?.message}
          {...register('dateVisite')}
        />
      </div>

      <Textarea
        label="Notes"
        error={errors.notes?.message}
        rows={3}
        {...register('notes')}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {chantier ? 'Modifier' : 'Creer'}
        </Button>
      </div>
    </form>
  );
}
