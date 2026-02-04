import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTemplates, useCategories } from './useTemplates';
import { templateService, PrestationTemplate } from '@/services/template.service';

vi.mock('@/services/template.service', () => ({
  templateService: {
    getAll: vi.fn(),
    getCategories: vi.fn(),
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
  {
    id: '2',
    name: 'Taille de haie',
    description: 'Taille et évacuation des déchets',
    category: 'entretien',
    unit: 'ml',
    unitPriceHT: 8.0,
    tvaRate: 20,
    isGlobal: true,
    createdBy: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

describe('useTemplates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches templates on mount', async () => {
    vi.mocked(templateService.getAll).mockResolvedValue(mockTemplates);

    const { result } = renderHook(() => useTemplates());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.error).toBeNull();
  });

  it('passes filters to service', async () => {
    vi.mocked(templateService.getAll).mockResolvedValue(mockTemplates);

    renderHook(() => useTemplates({ category: 'entretien', search: 'tonte' }));

    await waitFor(() => {
      expect(templateService.getAll).toHaveBeenCalledWith({
        category: 'entretien',
        search: 'tonte',
      });
    });
  });

  it('handles error state', async () => {
    vi.mocked(templateService.getAll).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTemplates());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.templates).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('provides refetch function', async () => {
    vi.mocked(templateService.getAll).mockResolvedValue(mockTemplates);

    const { result } = renderHook(() => useTemplates());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(templateService.getAll).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(templateService.getAll).toHaveBeenCalledTimes(2);
  });

  it('refetches when filters change', async () => {
    vi.mocked(templateService.getAll).mockResolvedValue(mockTemplates);

    const { result, rerender } = renderHook(
      ({ filters }) => useTemplates(filters),
      { initialProps: { filters: { category: 'entretien' } } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(templateService.getAll).toHaveBeenCalledWith({ category: 'entretien' });

    rerender({ filters: { category: 'elagage' } });

    await waitFor(() => {
      expect(templateService.getAll).toHaveBeenCalledWith({ category: 'elagage' });
    });
  });
});

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches categories on mount', async () => {
    const mockCategories = ['entretien', 'elagage', 'creation', 'divers'];
    vi.mocked(templateService.getCategories).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
  });

  it('handles error state', async () => {
    vi.mocked(templateService.getCategories).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
