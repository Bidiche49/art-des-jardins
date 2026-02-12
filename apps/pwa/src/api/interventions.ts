import apiClient from './client';
import type { PaginatedResponse, PaginationParams, UUID } from '@art-et-jardin/shared';

export type InterventionStatut = 'planifiee' | 'en_cours' | 'terminee' | 'annulee';

export interface Intervention {
  id: UUID;
  chantierId: UUID;
  date: Date;
  heureDebut: string;
  heureFin?: string;
  description: string;
  statut: InterventionStatut;
  responsableId?: UUID;
  equipeIds?: UUID[];
  notes?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInterventionDto {
  chantierId: UUID;
  date: Date;
  heureDebut: string;
  heureFin?: string;
  description: string;
  responsableId?: UUID;
  equipeIds?: UUID[];
  notes?: string;
}

export interface UpdateInterventionDto {
  date?: Date;
  heureDebut?: string;
  heureFin?: string;
  description?: string;
  statut?: InterventionStatut;
  responsableId?: UUID;
  equipeIds?: UUID[];
  notes?: string;
}

export interface InterventionFilters {
  chantierId?: string;
  statut?: InterventionStatut | InterventionStatut[];
  responsableId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export const interventionsApi = {
  getAll: async (
    params?: PaginationParams & InterventionFilters
  ): Promise<PaginatedResponse<Intervention>> => {
    const response = await apiClient.get<PaginatedResponse<Intervention>>(
      '/interventions',
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<Intervention> => {
    const response = await apiClient.get<Intervention>(`/interventions/${id}`);
    return response.data;
  },

  getByChantier: async (chantierId: string): Promise<Intervention[]> => {
    const response = await apiClient.get<PaginatedResponse<Intervention>>(
      '/interventions',
      { params: { chantierId, limit: 100 } }
    );
    return response.data.data;
  },

  getByDateRange: async (from: Date, to: Date): Promise<Intervention[]> => {
    const response = await apiClient.get<PaginatedResponse<Intervention>>(
      '/interventions',
      { params: { dateFrom: from, dateTo: to, limit: 100 } }
    );
    return response.data.data;
  },

  create: async (data: CreateInterventionDto): Promise<Intervention> => {
    // Combine date + HH:MM times into full ISO datetime strings for the API
    const d = data.date instanceof Date ? data.date : new Date(data.date);
    const dateOnly = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const apiData: Record<string, unknown> = {
      chantierId: data.chantierId,
      date: d.toISOString(),
      heureDebut: data.heureDebut.includes('T')
        ? data.heureDebut
        : new Date(`${dateOnly}T${data.heureDebut}:00`).toISOString(),
      description: data.description,
    };
    if (data.heureFin) {
      apiData.heureFin = data.heureFin.includes('T')
        ? data.heureFin
        : new Date(`${dateOnly}T${data.heureFin}:00`).toISOString();
    }
    if (data.notes) {
      apiData.notes = data.notes;
    }
    const response = await apiClient.post<Intervention>('/interventions', apiData);
    return response.data;
  },

  update: async (id: string, data: UpdateInterventionDto): Promise<Intervention> => {
    // Only send fields accepted by the API DTO
    const apiData: Record<string, unknown> = {};

    if (data.date) {
      const d = data.date instanceof Date ? data.date : new Date(data.date);
      const dateOnly = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      apiData.date = d.toISOString();

      if (data.heureDebut) {
        apiData.heureDebut = data.heureDebut.includes('T')
          ? data.heureDebut
          : new Date(`${dateOnly}T${data.heureDebut}:00`).toISOString();
      }
      if (data.heureFin) {
        apiData.heureFin = data.heureFin.includes('T')
          ? data.heureFin
          : new Date(`${dateOnly}T${data.heureFin}:00`).toISOString();
      }
    }
    if (data.description !== undefined) apiData.description = data.description;
    if (data.notes !== undefined) apiData.notes = data.notes;

    const response = await apiClient.put<Intervention>(`/interventions/${id}`, apiData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/interventions/${id}`);
  },

  start: async (id: string): Promise<Intervention> => {
    const response = await apiClient.post<Intervention>(`/interventions/${id}/start`);
    return response.data;
  },

  complete: async (id: string, heureFin?: string): Promise<Intervention> => {
    const response = await apiClient.post<Intervention>(`/interventions/${id}/complete`, {
      heureFin,
    });
    return response.data;
  },

  addPhoto: async (id: string, photoUrl: string): Promise<Intervention> => {
    const response = await apiClient.post<Intervention>(`/interventions/${id}/photos`, {
      url: photoUrl,
    });
    return response.data;
  },
};

export default interventionsApi;
