export type SoftDeleteEntity = 'client' | 'chantier' | 'devis' | 'facture' | 'intervention';

export interface TrashItem {
  id: string;
  entity: SoftDeleteEntity;
  deletedAt: Date;
  data: Record<string, any>;
}

export interface TrashStats {
  client: number;
  chantier: number;
  devis: number;
  facture: number;
  intervention: number;
  total: number;
}
