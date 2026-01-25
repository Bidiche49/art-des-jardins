import { BaseEntity, UUID } from './common';
import { LigneDevis } from './devis';

export type FactureStatut = 'brouillon' | 'envoyee' | 'payee' | 'annulee';

export interface Facture extends BaseEntity {
  devisId: UUID;
  numero: string; // ex: FAC-2025-001
  // Dates
  dateEmission: Date;
  dateEcheance: Date;
  datePaiement?: Date;
  // Contenu (copie du devis au moment de la facturation)
  lignes: LigneDevis[];
  // Totaux
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  // Paiement
  statut: FactureStatut;
  modePaiement?: 'virement' | 'cheque' | 'especes' | 'carte';
  referencePaiement?: string;
  // PDF
  pdfUrl?: string;
  // Notes
  mentionsLegales?: string;
  notes?: string;
}

export interface CreateFactureDto {
  devisId: UUID;
  dateEcheance: Date;
  mentionsLegales?: string;
  notes?: string;
}

export interface UpdateFactureDto {
  statut?: FactureStatut;
  datePaiement?: Date;
  modePaiement?: 'virement' | 'cheque' | 'especes' | 'carte';
  referencePaiement?: string;
  notes?: string;
}
