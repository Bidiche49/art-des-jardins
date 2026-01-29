import apiClient from './client';
import type {
  Facture,
  CreateFactureDto,
  UpdateFactureDto,
  PaginatedResponse,
  PaginationParams,
  FactureStatut,
} from '@art-et-jardin/shared';

export interface FactureFilters {
  devisId?: string;
  statut?: FactureStatut | FactureStatut[];
  dateEmissionFrom?: Date;
  dateEmissionTo?: Date;
  dateEcheanceFrom?: Date;
  dateEcheanceTo?: Date;
}

export const facturesApi = {
  getAll: async (
    params?: PaginationParams & FactureFilters
  ): Promise<PaginatedResponse<Facture>> => {
    const response = await apiClient.get<PaginatedResponse<Facture>>('/factures', {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Facture> => {
    const response = await apiClient.get<Facture>(`/factures/${id}`);
    return response.data;
  },

  create: async (data: CreateFactureDto): Promise<Facture> => {
    const response = await apiClient.post<Facture>('/factures', data);
    return response.data;
  },

  update: async (id: string, data: UpdateFactureDto): Promise<Facture> => {
    const response = await apiClient.put<Facture>(`/factures/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/factures/${id}`);
  },

  getPdf: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/factures/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  send: async (id: string, email?: string): Promise<void> => {
    await apiClient.post(`/factures/${id}/send`, { email });
  },

  markAsPaid: async (
    id: string,
    data: { modePaiement: string; referencePaiement?: string }
  ): Promise<Facture> => {
    const response = await apiClient.post<Facture>(`/factures/${id}/pay`, data);
    return response.data;
  },
};

export default facturesApi;
