import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFacturesStore } from '@/stores';
import {
  Card,
  Select,
  Badge,
  Pagination,
  LoadingOverlay,
  EmptyState,
} from '@/components/ui';
import type { FactureStatut } from '@art-et-jardin/shared';
import { format } from 'date-fns';

const STATUT_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'envoyee', label: 'Envoyee' },
  { value: 'payee', label: 'Payee' },
  { value: 'annulee', label: 'Annulee' },
];

const STATUT_BADGES: Record<FactureStatut, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  brouillon: { label: 'Brouillon', variant: 'default' },
  envoyee: { label: 'Envoyee', variant: 'warning' },
  payee: { label: 'Payee', variant: 'success' },
  annulee: { label: 'Annulee', variant: 'danger' },
};

export function Factures() {
  const navigate = useNavigate();
  const {
    factures,
    isLoading,
    pagination,
    filters,
    fetchFactures,
    setFilters,
    setPage,
  } = useFacturesStore();

  const [statutFilter, setStatutFilter] = useState<string>(
    Array.isArray(filters.statut) ? '' : filters.statut || ''
  );

  useEffect(() => {
    fetchFactures();
  }, [fetchFactures]);

  const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FactureStatut | '';
    setStatutFilter(value);
    setFilters({ ...filters, statut: value || undefined });
  };

  if (isLoading && factures.length === 0) {
    return <LoadingOverlay message="Chargement des factures..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
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

      {factures.length === 0 ? (
        <EmptyState
          icon="💶"
          title="Aucune facture"
          description={
            filters.statut
              ? 'Aucune facture ne correspond a votre filtre'
              : "Les factures sont generees a partir des devis acceptes"
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {factures.map((facture) => (
              <Card
                key={facture.id}
                hoverable
                onClick={() => navigate(`/factures/${facture.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {facture.numero}
                    </div>
                    <div className="text-sm text-gray-500">
                      Emise le {format(new Date(facture.dateEmission), 'dd/MM/yyyy')}
                    </div>
                    <div className="text-sm text-gray-400">
                      Echeance: {format(new Date(facture.dateEcheance), 'dd/MM/yyyy')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {facture.totalTTC.toFixed(2)} €
                      </div>
                      {facture.datePaiement && (
                        <div className="text-sm text-green-600">
                          Payee le {format(new Date(facture.datePaiement), 'dd/MM/yyyy')}
                        </div>
                      )}
                    </div>
                    <Badge variant={STATUT_BADGES[facture.statut].variant}>
                      {STATUT_BADGES[facture.statut].label}
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
