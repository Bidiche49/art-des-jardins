import { useState, useEffect, useCallback, useMemo } from 'react';
import { templateService, PrestationTemplate, TemplateFilters } from '@/services/template.service';

interface UseTemplatesResult {
  templates: PrestationTemplate[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTemplates(filters?: TemplateFilters): UseTemplatesResult {
  const [templates, setTemplates] = useState<PrestationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const stableFilters = useMemo(
    () => filters,
    [filters?.category, filters?.search]
  );

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await templateService.getAll(stableFilters);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement'));
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates,
  };
}

interface UseCategoriesResult {
  categories: string[];
  isLoading: boolean;
  error: Error | null;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await templateService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement'));
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
}
