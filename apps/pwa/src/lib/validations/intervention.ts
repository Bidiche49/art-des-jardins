import { z } from 'zod';

export const interventionSchema = z.object({
  chantierId: z.string().min(1, 'Le chantier est requis'),
  date: z.coerce.date({ required_error: 'La date est requise' }),
  heureDebut: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:MM)'),
  heureFin: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:MM)')
    .optional(),
  description: z.string().min(1, 'La description est requise'),
  responsableId: z.string().optional(),
  equipeIds: z.array(z.string()).optional(),
  notes: z.string().max(2000, 'Les notes sont trop longues').optional(),
});

export type InterventionFormData = z.infer<typeof interventionSchema>;
