import { BaseEntity, UUID } from './common';

export type ChantierStatut =
  | 'lead'
  | 'visite_planifiee'
  | 'devis_envoye'
  | 'accepte'
  | 'planifie'
  | 'en_cours'
  | 'termine'
  | 'facture'
  | 'annule';

export type TypePrestation =
  | 'paysagisme'
  | 'entretien'
  | 'elagage'
  | 'abattage'
  | 'tonte'
  | 'taille'
  | 'autre';

export interface Chantier extends BaseEntity {
  clientId: UUID;
  // Localisation
  adresse: string;
  codePostal: string;
  ville: string;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  // Details
  typePrestation: TypePrestation[];
  description: string;
  surface?: number;
  // Planning
  statut: ChantierStatut;
  dateVisite?: Date;
  dateDebut?: Date;
  dateFin?: Date;
  // Responsables
  responsableId?: UUID;
  equipeIds?: UUID[];
  // Metadata
  notes?: string;
  photos?: string[];
}

export interface CreateChantierDto {
  clientId: UUID;
  adresse: string;
  codePostal: string;
  ville: string;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  typePrestation: TypePrestation[];
  description: string;
  surface?: number;
  dateVisite?: Date;
  notes?: string;
}

export interface UpdateChantierDto extends Partial<CreateChantierDto> {
  statut?: ChantierStatut;
  dateDebut?: Date;
  dateFin?: Date;
  responsableId?: UUID;
  equipeIds?: UUID[];
}

export interface ChantierFilters {
  clientId?: UUID;
  statut?: ChantierStatut | ChantierStatut[];
  typePrestation?: TypePrestation;
  ville?: string;
  responsableId?: UUID;
  dateDebutFrom?: Date;
  dateDebutTo?: Date;
}
