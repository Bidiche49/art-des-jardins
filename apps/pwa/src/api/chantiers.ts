import apiClient from './client';
import type {
  Chantier,
  CreateChantierDto,
  UpdateChantierDto,
  ChantierFilters,
  PaginatedResponse,
  PaginationParams,
} from '@art-et-jardin/shared';

export const chantiersApi = {
  getAll: async (
    params?: PaginationParams & ChantierFilters
  ): Promise<PaginatedResponse<Chantier>> => {
    const response = await apiClient.get<PaginatedResponse<Chantier>>('/chantiers', {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Chantier> => {
    const response = await apiClient.get<Chantier>(`/chantiers/${id}`);
    return response.data;
  },

  getByClient: async (clientId: string): Promise<Chantier[]> => {
    const response = await apiClient.get<PaginatedResponse<Chantier>>('/chantiers', {
      params: { clientId, limit: 100 },
    });
    return response.data.data;
  },

  create: async (data: CreateChantierDto): Promise<Chantier> => {
    const response = await apiClient.post<Chantier>('/chantiers', data);
    return response.data;
  },

  update: async (id: string, data: UpdateChantierDto): Promise<Chantier> => {
    const response = await apiClient.put<Chantier>(`/chantiers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/chantiers/${id}`);
  },

  addPhoto: async (id: string, photoUrl: string): Promise<Chantier> => {
    const response = await apiClient.post<Chantier>(`/chantiers/${id}/photos`, {
      url: photoUrl,
    });
    return response.data;
  },

  removePhoto: async (id: string, photoUrl: string): Promise<Chantier> => {
    const response = await apiClient.delete<Chantier>(`/chantiers/${id}/photos`, {
      data: { url: photoUrl },
    });
    return response.data;
  },
};

export default chantiersApi;
