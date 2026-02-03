import apiClient from '@/api/client';

export type RentabiliteStatus = 'profitable' | 'limite' | 'perte';

export interface RentabiliteHeureDetail {
  employeId: string;
  employeNom: string;
  heures: number;
  tauxHoraire: number;
  cout: number;
}

export interface RentabiliteMateriau {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  totalCost: number;
}

export interface RentabiliteDto {
  chantierId: string;
  chantierNom: string;
  prevu: {
    montantHT: number;
    heuresEstimees: number | null;
  };
  reel: {
    heures: number;
    coutHeures: number;
    coutMateriaux: number;
    coutTotal: number;
    heuresDetail?: RentabiliteHeureDetail[];
    materiauxDetail?: RentabiliteMateriau[];
  };
  marge: {
    montant: number;
    pourcentage: number;
  };
  status: RentabiliteStatus;
}

export interface RapportFilters {
  dateDebut?: string;
  dateFin?: string;
}

export const rentabiliteService = {
  getRentabilite: async (chantierId: string): Promise<RentabiliteDto> => {
    const response = await apiClient.get<RentabiliteDto>(`/chantiers/${chantierId}/rentabilite`);
    return response.data;
  },

  getRapport: async (filters?: RapportFilters): Promise<RentabiliteDto[]> => {
    const response = await apiClient.get<RentabiliteDto[]>('/rentabilite/rapport', {
      params: filters,
    });
    return response.data;
  },
};

export default rentabiliteService;
