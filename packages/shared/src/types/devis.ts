import { BaseEntity, UUID } from './common';

export type DevisStatut = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';

export interface LigneDevis {
  id: UUID;
  description: string;
  quantite: number;
  unite: string;
  prixUnitaireHT: number;
  tva: number; // En pourcentage (ex: 10, 20)
  montantHT: number;
  montantTTC: number;
}

export interface Devis extends BaseEntity {
  chantierId: UUID;
  numero: string; // ex: DEV-2025-001
  // Dates
  dateEmission: Date;
  dateValidite: Date;
  // Contenu
  lignes: LigneDevis[];
  // Totaux
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  // Statut
  statut: DevisStatut;
  dateAcceptation?: Date;
  signatureClient?: string;
  // PDF
  pdfUrl?: string;
  // Notes
  conditionsParticulieres?: string;
  notes?: string;
}

export interface CreateDevisDto {
  chantierId: UUID;
  dateValidite: Date;
  lignes: Omit<LigneDevis, 'id' | 'montantHT' | 'montantTTC'>[];
  conditionsParticulieres?: string;
  notes?: string;
}

export interface UpdateDevisDto {
  dateValidite?: Date;
  lignes?: Omit<LigneDevis, 'id' | 'montantHT' | 'montantTTC'>[];
  statut?: DevisStatut;
  conditionsParticulieres?: string;
  notes?: string;
}
