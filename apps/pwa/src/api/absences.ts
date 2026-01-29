import apiClient from './client';
import type { PaginatedResponse, PaginationParams, UUID } from '@art-et-jardin/shared';

export type AbsenceType = 'conge' | 'maladie' | 'formation' | 'autre';

export interface Absence {
  id: UUID;
  userId: UUID;
  dateDebut: string;
  dateFin: string;
  type: AbsenceType;
  motif?: string;
  validee: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: UUID;
    nom: string;
    prenom: string;
    email?: string;
  };
}

export interface CreateAbsenceDto {
  userId?: UUID;
  dateDebut: string;
  dateFin: string;
  type: AbsenceType;
  motif?: string;
}

export interface UpdateAbsenceDto {
  dateDebut?: string;
  dateFin?: string;
  type?: AbsenceType;
  motif?: string;
}

export interface AbsenceFilters {
  userId?: string;
  dateDebut?: string;
  dateFin?: string;
  type?: AbsenceType;
  validee?: boolean;
}

export const absencesApi = {
  getAll: async (
    params?: PaginationParams & AbsenceFilters
  ): Promise<PaginatedResponse<Absence>> => {
    const response = await apiClient.get<PaginatedResponse<Absence>>(
      '/absences',
      { params }
    );
    return response.data;
  },

  getPending: async (): Promise<PaginatedResponse<Absence>> => {
    const response = await apiClient.get<PaginatedResponse<Absence>>(
      '/absences/pending'
    );
    return response.data;
  },

  getMine: async (
    params?: PaginationParams & AbsenceFilters
  ): Promise<PaginatedResponse<Absence>> => {
    const response = await apiClient.get<PaginatedResponse<Absence>>(
      '/absences/mes-absences',
      { params }
    );
    return response.data;
  },

  getForCalendar: async (dateDebut: string, dateFin: string): Promise<Absence[]> => {
    const response = await apiClient.get<Absence[]>(
      '/absences/calendar',
      { params: { dateDebut, dateFin } }
    );
    return response.data;
  },

  getById: async (id: string): Promise<Absence> => {
    const response = await apiClient.get<Absence>(`/absences/${id}`);
    return response.data;
  },

  create: async (data: CreateAbsenceDto): Promise<Absence> => {
    const response = await apiClient.post<Absence>('/absences', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAbsenceDto): Promise<Absence> => {
    const response = await apiClient.put<Absence>(`/absences/${id}`, data);
    return response.data;
  },

  valider: async (id: string): Promise<Absence> => {
    const response = await apiClient.patch<Absence>(`/absences/${id}/valider`);
    return response.data;
  },

  refuser: async (id: string): Promise<{ message: string; absence: Absence }> => {
    const response = await apiClient.patch<{ message: string; absence: Absence }>(
      `/absences/${id}/refuser`
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/absences/${id}`);
  },
};

export default absencesApi;
