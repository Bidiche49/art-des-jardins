import { z } from 'zod';

export const clientSchema = z.object({
  type: z.enum(['particulier', 'professionnel', 'syndic'], {
    required_error: 'Le type de client est requis',
  }),
  nom: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  prenom: z.string().max(100, 'Le prénom est trop long').optional(),
  raisonSociale: z.string().max(200, 'La raison sociale est trop longue').optional(),
  email: z.string().email('Email invalide'),
  telephone: z
    .string()
    .min(10, 'Le téléphone doit contenir au moins 10 caractères')
    .regex(/^[0-9+\s-]+$/, 'Format de téléphone invalide'),
  telephoneSecondaire: z
    .string()
    .regex(/^[0-9+\s-]*$/, 'Format de téléphone invalide')
    .optional(),
  adresse: z.string().min(1, "L'adresse est requise"),
  codePostal: z
    .string()
    .min(5, 'Le code postal doit contenir 5 caractères')
    .max(5, 'Le code postal doit contenir 5 caractères')
    .regex(/^[0-9]+$/, 'Code postal invalide'),
  ville: z.string().min(1, 'La ville est requise'),
  notes: z.string().max(2000, 'Les notes sont trop longues').optional(),
  tags: z.array(z.string()).optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
