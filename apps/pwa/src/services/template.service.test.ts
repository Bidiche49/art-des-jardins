import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/client';
import { templateService, PrestationTemplate } from './template.service';

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockTemplates: PrestationTemplate[] = [
  {
    id: '1',
    name: 'Tonte pelouse',
    description: 'Tonte de la pelouse avec ramassage',
    category: 'entretien',
    unit: 'm2',
    unitPriceHT: 2.5,
    tvaRate: 20,
    isGlobal: true,
    createdBy: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

describe('templateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('fetches all templates without filters', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockTemplates });

      const result = await templateService.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/templates', {
        params: undefined,
      });
      expect(result).toEqual(mockTemplates);
    });

    it('fetches templates with category filter', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockTemplates });

      await templateService.getAll({ category: 'entretien' });

      expect(apiClient.get).toHaveBeenCalledWith('/templates', {
        params: { category: 'entretien' },
      });
    });

    it('fetches templates with search filter', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockTemplates });

      await templateService.getAll({ search: 'tonte' });

      expect(apiClient.get).toHaveBeenCalledWith('/templates', {
        params: { search: 'tonte' },
      });
    });

    it('fetches templates with both filters', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockTemplates });

      await templateService.getAll({ category: 'entretien', search: 'tonte' });

      expect(apiClient.get).toHaveBeenCalledWith('/templates', {
        params: { category: 'entretien', search: 'tonte' },
      });
    });
  });

  describe('getById', () => {
    it('fetches a single template by id', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockTemplates[0] });

      const result = await templateService.getById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/templates/1');
      expect(result).toEqual(mockTemplates[0]);
    });
  });

  describe('getCategories', () => {
    it('fetches all categories', async () => {
      const mockCategories = ['entretien', 'elagage', 'creation', 'divers'];
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockCategories });

      const result = await templateService.getCategories();

      expect(apiClient.get).toHaveBeenCalledWith('/templates/categories');
      expect(result).toEqual(mockCategories);
    });
  });
});
