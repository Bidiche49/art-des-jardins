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
    const response = await apiClient.post<Devis>('/devis', data);
    return response.data;
  },

  update: async (id: string, data: UpdateDevisDto): Promise<Devis> => {
    const response = await apiClient.put<Devis>(`/devis/${id}`, data);
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
