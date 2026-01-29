import { z } from 'zod';

export const chantierSchema = z.object({
  clientId: z.string().min(1, 'Le client est requis'),
  adresse: z.string().min(1, "L'adresse est requise"),
  codePostal: z
    .string()
    .min(5, 'Le code postal doit contenir 5 caractères')
    .max(5, 'Le code postal doit contenir 5 caractères')
    .regex(/^[0-9]+$/, 'Code postal invalide'),
  ville: z.string().min(1, 'La ville est requise'),
  typePrestation: z
    .array(
      z.enum([
        'paysagisme',
        'entretien',
        'elagage',
        'abattage',
        'tonte',
        'taille',
        'autre',
      ])
    )
    .min(1, 'Au moins un type de prestation est requis'),
  description: z.string().min(1, 'La description est requise'),
  surface: z.number().positive('La surface doit être positive').optional(),
  dateVisite: z.coerce.date().optional(),
  notes: z.string().max(2000, 'Les notes sont trop longues').optional(),
});

export type ChantierFormData = z.infer<typeof chantierSchema>;

export const TYPES_PRESTATION = [
  { value: 'paysagisme', label: 'Paysagisme' },
  { value: 'entretien', label: 'Entretien' },
  { value: 'elagage', label: 'Elagage' },
  { value: 'abattage', label: 'Abattage' },
  { value: 'tonte', label: 'Tonte' },
  { value: 'taille', label: 'Taille' },
  { value: 'autre', label: 'Autre' },
];
