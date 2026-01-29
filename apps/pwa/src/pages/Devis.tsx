import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevisStore } from '@/stores';
import {
  Button,
  Card,
  Select,
  Badge,
  Pagination,
  LoadingOverlay,
  EmptyState,
} from '@/components/ui';
import type { DevisStatut } from '@art-et-jardin/shared';
import { format } from 'date-fns';

const STATUT_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'envoye', label: 'Envoye' },
  { value: 'accepte', label: 'Accepte' },
  { value: 'refuse', label: 'Refuse' },
  { value: 'expire', label: 'Expire' },
];

const STATUT_BADGES: Record<DevisStatut, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  brouillon: { label: 'Brouillon', variant: 'default' },
  envoye: { label: 'Envoye', variant: 'warning' },
  accepte: { label: 'Accepte', variant: 'success' },
  refuse: { label: 'Refuse', variant: 'danger' },
  expire: { label: 'Expire', variant: 'default' },
};

export function Devis() {
  const navigate = useNavigate();
  const {
    devisList,
    isLoading,
    pagination,
    filters,
    fetchDevis,
    setFilters,
    setPage,
  } = useDevisStore();

  const [statutFilter, setStatutFilter] = useState<string>(
    Array.isArray(filters.statut) ? '' : filters.statut || ''
  );

  useEffect(() => {
    fetchDevis();
  }, [fetchDevis]);

  const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DevisStatut | '';
    setStatutFilter(value);
    setFilters({ ...filters, statut: value || undefined });
  };

  if (isLoading && devisList.length === 0) {
    return <LoadingOverlay message="Chargement des devis..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
        <Button onClick={() => navigate('/devis/nouveau')}>+ Nouveau</Button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1" />
        <div className="w-44">
          <Select
            options={STATUT_OPTIONS}
            value={statutFilter}
            onChange={handleStatutChange}
          />
        </div>
      </div>

      {devisList.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Aucun devis"
          description={
            filters.statut
              ? 'Aucun devis ne correspond a votre filtre'
              : "Creez votre premier devis"
          }
          action={
            !filters.statut
              ? { label: 'Creer un devis', onClick: () => navigate('/devis/nouveau') }
              : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {devisList.map((devis) => (
              <Card
                key={devis.id}
                hoverable
                onClick={() => navigate(`/devis/${devis.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {devis.numero}
                    </div>
                    <div className="text-sm text-gray-500">
                      Emis le {format(new Date(devis.dateEmission), 'dd/MM/yyyy')}
                    </div>
                    <div className="text-sm text-gray-400">
                      Valide jusqu'au {format(new Date(devis.dateValidite), 'dd/MM/yyyy')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {devis.totalTTC.toFixed(2)} €
                      </div>
                      <div className="text-sm text-gray-500">
                        HT: {devis.totalHT.toFixed(2)} €
                      </div>
                    </div>
                    <Badge variant={STATUT_BADGES[devis.statut].variant}>
                      {STATUT_BADGES[devis.statut].label}
                    </Badge>
                    <svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
