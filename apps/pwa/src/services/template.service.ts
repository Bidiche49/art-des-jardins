import apiClient from '@/api/client';

export interface PrestationTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  unitPriceHT: number;
  tvaRate: number;
  isGlobal: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilters {
  category?: string;
  search?: string;
}

export const templateService = {
  getAll: async (filters?: TemplateFilters): Promise<PrestationTemplate[]> => {
    const response = await apiClient.get('/templates', {
      params: filters,
    });
    // API returns paginated { data: [...], meta: {...} } or flat array
    const result = response.data;
    return Array.isArray(result) ? result : result.data || [];
  },

  getById: async (id: string): Promise<PrestationTemplate> => {
    const response = await apiClient.get<PrestationTemplate>(`/templates/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/templates/categories');
    return response.data;
  },
};

export default templateService;
