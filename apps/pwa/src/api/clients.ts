import apiClient from './client';
import type {
  Client,
  CreateClientDto,
  UpdateClientDto,
  ClientFilters,
  PaginatedResponse,
  PaginationParams,
} from '@art-et-jardin/shared';

export const clientsApi = {
  getAll: async (
    params?: PaginationParams & ClientFilters
  ): Promise<PaginatedResponse<Client>> => {
    const response = await apiClient.get<PaginatedResponse<Client>>('/clients', {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    return response.data;
  },

  create: async (data: CreateClientDto): Promise<Client> => {
    const response = await apiClient.post<Client>('/clients', data);
    return response.data;
  },

  update: async (id: string, data: UpdateClientDto): Promise<Client> => {
    const response = await apiClient.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};

export default clientsApi;
