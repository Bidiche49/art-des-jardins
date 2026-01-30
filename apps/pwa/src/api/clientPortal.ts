import axios from 'axios';
import { useClientAuthStore } from '@/stores/clientAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const clientPortalApi = axios.create({
  baseURL: `${API_URL}/api/v1/client-portal`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

clientPortalApi.interceptors.request.use((config) => {
  const { accessToken } = useClientAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

clientPortalApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useClientAuthStore.getState().logout();
      window.location.href = '/client/login';
    }
    return Promise.reject(error);
  }
);

interface DashboardStats {
  devis: {
    enAttente: number;
    acceptes: number;
    total: number;
  };
  factures: {
    aPayer: number;
    payees: number;
    montantDu: number;
  };
  chantiers: Array<{
    id: string;
    description: string;
    statut: string;
    adresse: string;
  }>;
}

interface Devis {
  id: string;
  numero: string;
  dateEmission: string;
  dateValidite: string;
  totalTTC: number;
  statut: string;
  chantierDescription: string;
}

interface Facture {
  id: string;
  numero: string;
  dateEmission: string;
  dateEcheance: string;
  totalTTC: number;
  statut: string;
  devisNumero: string;
  chantierDescription: string;
}

interface Intervention {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string | null;
  description: string | null;
  photos: string[];
  valide: boolean;
}

interface Chantier {
  id: string;
  description: string;
  adresse: string;
  codePostal: string;
  ville: string;
  statut: string;
  dateDebut: string | null;
  dateFin: string | null;
  photos?: string[];
  interventions?: Intervention[];
}

export const clientPortalApiService = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await clientPortalApi.get('/dashboard');
    return response.data;
  },

  getDevis: async (): Promise<Devis[]> => {
    const response = await clientPortalApi.get('/devis');
    return response.data;
  },

  getDevisById: async (id: string): Promise<Devis> => {
    const response = await clientPortalApi.get(`/devis/${id}`);
    return response.data;
  },

  getFactures: async (): Promise<Facture[]> => {
    const response = await clientPortalApi.get('/factures');
    return response.data;
  },

  getFactureById: async (id: string): Promise<Facture> => {
    const response = await clientPortalApi.get(`/factures/${id}`);
    return response.data;
  },

  getChantiers: async (): Promise<Chantier[]> => {
    const response = await clientPortalApi.get('/chantiers');
    return response.data;
  },

  getChantierById: async (id: string): Promise<Chantier> => {
    const response = await clientPortalApi.get(`/chantiers/${id}`);
    return response.data;
  },
};
