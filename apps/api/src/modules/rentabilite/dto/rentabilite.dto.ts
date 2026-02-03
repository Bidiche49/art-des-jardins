export interface RentabiliteDto {
  chantierId: string;
  chantierNom: string;
  chantierAdresse: string;
  clientNom: string;
  prevu: {
    montantHT: number | null;
    heuresEstimees: number | null;
  };
  reel: {
    heures: number;
    coutHeures: number;
    coutMateriaux: number;
    coutTotal: number;
  };
  marge: {
    montant: number | null;
    pourcentage: number | null;
  };
  status: 'profitable' | 'limite' | 'perte' | 'indetermine';
}
