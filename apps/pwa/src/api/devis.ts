import apiClient from './client';
import type {
  Devis,
  CreateDevisDto,
  UpdateDevisDto,
  PaginatedResponse,
  PaginationParams,
  DevisStatut,
} from '@art-et-jardin/shared';

export interface DevisFilters {
  chantierId?: string;
  statut?: DevisStatut | DevisStatut[];
  dateEmissionFrom?: Date;
  dateEmissionTo?: Date;
}

export const devisApi = {
  getAll: async (
    params?: PaginationParams & DevisFilters
  ): Promise<PaginatedResponse<Devis>> => {
    const response = await apiClient.get<PaginatedResponse<Devis>>('/devis', {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Devis> => {
    const response = await apiClient.get<Devis>(`/devis/${id}`);
    return response.data;
  },

  getByChantier: async (chantierId: string): Promise<Devis[]> => {
    const response = await apiClient.get<PaginatedResponse<Devis>>('/devis', {
      params: { chantierId, limit: 100 },
    });
    return response.data.data;
  },

  create: async (data: CreateDevisDto): Promise<Devis> => {
    // Transform shared DTO to API DTO format
    const now = new Date();
    const validite = data.dateValidite ? new Date(data.dateValidite) : null;
    const validiteJours = validite
      ? Math.max(1, Math.ceil((validite.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 30;

    const apiData: Record<string, unknown> = {
      chantierId: data.chantierId,
      validiteJours,
      lignes: data.lignes,
    };
    if (data.conditionsParticulieres) apiData.conditionsParticulieres = data.conditionsParticulieres;
    if (data.notes) apiData.notes = data.notes;

    const response = await apiClient.post<Devis>('/devis', apiData);
    return response.data;
  },

  update: async (id: string, data: UpdateDevisDto): Promise<Devis> => {
    // Transform dateValidite to validiteJours like create does
    const apiData: Record<string, unknown> = { ...data };
    if (data.dateValidite) {
      const now = new Date();
      const validite = new Date(data.dateValidite);
      apiData.validiteJours = Math.max(1, Math.ceil((validite.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      delete apiData.dateValidite;
    }
    const response = await apiClient.put<Devis>(`/devis/${id}`, apiData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/devis/${id}`);
  },

  getPdf: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/devis/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  send: async (id: string, email?: string): Promise<void> => {
    await apiClient.post(`/devis/${id}/send`, { email });
  },

  accept: async (id: string, signature?: string): Promise<Devis> => {
    const response = await apiClient.post<Devis>(`/devis/${id}/accept`, {
      signature,
    });
    return response.data;
  },

  refuse: async (id: string, reason?: string): Promise<Devis> => {
    const response = await apiClient.post<Devis>(`/devis/${id}/refuse`, {
      reason,
    });
    return response.data;
  },
};

export default devisApi;
