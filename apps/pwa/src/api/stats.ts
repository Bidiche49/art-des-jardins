import apiClient from './client';

export interface DashboardStats {
  clientsTotal: number;
  chantiersEnCours: number;
  devisEnAttente: number;
  facturesImpayees: number;
  caMois: number;
  caAnnee: number;
}

export interface ChiffreAffairesMensuel {
  mois: string;
  ca: number;
}

export interface InterventionAVenir {
  id: string;
  date: Date;
  description: string;
  clientNom: string;
  clientVille: string;
  chantierAdresse: string;
}

export const statsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/stats/dashboard');
    return response.data;
  },

  getChiffreAffaires: async (
    annee: number = new Date().getFullYear()
  ): Promise<ChiffreAffairesMensuel[]> => {
    const response = await apiClient.get<ChiffreAffairesMensuel[]>('/stats/ca', {
      params: { annee },
    });
    return response.data;
  },

  getInterventionsAVenir: async (
    jours: number = 7
  ): Promise<InterventionAVenir[]> => {
    const response = await apiClient.get<InterventionAVenir[]>(
      '/stats/interventions-a-venir',
      { params: { jours } }
    );
    return response.data;
  },
};

export default statsApi;
