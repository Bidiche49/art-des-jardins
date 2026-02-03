import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, LoadingOverlay } from '@/components/ui';
import { RentabiliteDetail } from '@/components/rentabilite';
import { useRentabilite } from '@/hooks/useRentabilite';
import { useChantiersStore } from '@/stores';

export function ChantierRentabilite() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rentabilite, isLoading, error, refetch } = useRentabilite(id);
  const { selectedChantier, fetchChantierById, isLoading: chantierLoading } = useChantiersStore();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchChantierById(id).finally(() => setPageLoading(false));
    }
  }, [id, fetchChantierById]);

  if (pageLoading || chantierLoading) {
    return <LoadingOverlay message="Chargement..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header avec breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/chantiers/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Retour au chantier"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Rentabilite</h1>
          {selectedChantier && (
            <p className="text-gray-500 text-sm">
              {selectedChantier.adresse} - {selectedChantier.ville}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          Actualiser
        </Button>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <button
              onClick={() => navigate('/chantiers')}
              className="hover:text-primary-600 hover:underline"
            >
              Chantiers
            </button>
          </li>
          <li>
            <span className="mx-1">/</span>
          </li>
          <li>
            <button
              onClick={() => navigate(`/chantiers/${id}`)}
              className="hover:text-primary-600 hover:underline"
            >
              {selectedChantier?.adresse || 'Chantier'}
            </button>
          </li>
          <li>
            <span className="mx-1">/</span>
          </li>
          <li className="text-gray-900 font-medium">Rentabilite</li>
        </ol>
      </nav>

      {/* Contenu principal */}
      <RentabiliteDetail
        rentabilite={rentabilite}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default ChantierRentabilite;
