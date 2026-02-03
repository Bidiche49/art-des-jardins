import { useState, useEffect, useCallback } from 'react';
import { rentabiliteService, RentabiliteDto } from '@/services/rentabilite.service';

interface UseRentabiliteResult {
  rentabilite: RentabiliteDto | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useRentabilite(chantierId: string | undefined): UseRentabiliteResult {
  const [rentabilite, setRentabilite] = useState<RentabiliteDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRentabilite = useCallback(async () => {
    if (!chantierId) {
      setRentabilite(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await rentabiliteService.getRentabilite(chantierId);
      setRentabilite(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement'));
      setRentabilite(null);
    } finally {
      setIsLoading(false);
    }
  }, [chantierId]);

  useEffect(() => {
    fetchRentabilite();
  }, [fetchRentabilite]);

  return {
    rentabilite,
    isLoading,
    error,
    refetch: fetchRentabilite,
  };
}
