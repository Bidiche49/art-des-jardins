import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { clientSchema, type ClientFormData } from '@/lib/validations';
import type { Client } from '@art-et-jardin/shared';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CLIENT_TYPES = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'syndic', label: 'Syndic' },
];

export function ClientForm({
  client,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          type: client.type,
          nom: client.nom,
          prenom: client.prenom || '',
          raisonSociale: client.raisonSociale || '',
          email: client.email,
          telephone: client.telephone,
          telephoneSecondaire: client.telephoneSecondaire || '',
          adresse: client.adresse,
          codePostal: client.codePostal,
          ville: client.ville,
          notes: client.notes || '',
        }
      : {
          type: 'particulier',
        },
  });

  const clientType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Type de client"
        options={CLIENT_TYPES}
        error={errors.type?.message}
        required
        {...register('type')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nom"
          error={errors.nom?.message}
          required
          {...register('nom')}
        />
        {clientType === 'particulier' && (
          <Input
            label="Prenom"
            error={errors.prenom?.message}
            {...register('prenom')}
          />
        )}
      </div>

      {clientType !== 'particulier' && (
        <Input
          label="Raison sociale"
          error={errors.raisonSociale?.message}
          {...register('raisonSociale')}
        />
      )}

      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Telephone"
          type="tel"
          error={errors.telephone?.message}
          required
          {...register('telephone')}
        />
        <Input
          label="Telephone secondaire"
          type="tel"
          error={errors.telephoneSecondaire?.message}
          {...register('telephoneSecondaire')}
        />
      </div>

      <Input
        label="Adresse"
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
          {client ? 'Modifier' : 'Creer'}
        </Button>
      </div>
    </form>
  );
}
