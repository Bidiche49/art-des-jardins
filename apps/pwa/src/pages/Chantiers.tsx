import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChantiersStore, useClientsStore } from '@/stores';
import {
  Button,
  Card,
  SearchInput,
  Select,
  Badge,
  Pagination,
  LoadingOverlay,
  EmptyState,
  Modal,
} from '@/components/ui';
import { ChantierForm } from '@/components/forms';
import type { ChantierFormData } from '@/lib/validations';
import type { ChantierStatut } from '@art-et-jardin/shared';
import toast from 'react-hot-toast';

const STATUT_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'lead', label: 'Lead' },
  { value: 'visite_planifiee', label: 'Visite planifiee' },
  { value: 'devis_envoye', label: 'Devis envoye' },
  { value: 'accepte', label: 'Accepte' },
  { value: 'planifie', label: 'Planifie' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Termine' },
  { value: 'facture', label: 'Facture' },
  { value: 'annule', label: 'Annule' },
];

const STATUT_BADGES: Record<ChantierStatut, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }> = {
  lead: { label: 'Lead', variant: 'default' },
  visite_planifiee: { label: 'Visite', variant: 'info' },
  devis_envoye: { label: 'Devis', variant: 'warning' },
  accepte: { label: 'Accepte', variant: 'success' },
  planifie: { label: 'Planifie', variant: 'info' },
  en_cours: { label: 'En cours', variant: 'primary' },
  termine: { label: 'Termine', variant: 'success' },
  facture: { label: 'Facture', variant: 'success' },
  annule: { label: 'Annule', variant: 'danger' },
};

export function Chantiers() {
  const navigate = useNavigate();
  const {
    chantiers,
    isLoading,
    pagination,
    filters,
    fetchChantiers,
    createChantier,
    setFilters,
    setPage,
  } = useChantiersStore();
  const { clients, fetchClients } = useClientsStore();

  const [statutFilter, setStatutFilter] = useState<string>(
    Array.isArray(filters.statut) ? '' : filters.statut || ''
  );
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchChantiers();
    fetchClients();
  }, [fetchChantiers, fetchClients]);

  const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ChantierStatut | '';
    setStatutFilter(value);
    setFilters({ ...filters, statut: value || undefined });
  };

  const handleCreateChantier = async (data: ChantierFormData) => {
    setFormLoading(true);
    try {
      const chantier = await createChantier(data);
      toast.success('Chantier cree avec succes');
      setShowForm(false);
      navigate(`/chantiers/${chantier.id}`);
    } catch {
      toast.error('Erreur lors de la creation');
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading && chantiers.length === 0) {
    return <LoadingOverlay message="Chargement des chantiers..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chantiers</h1>
        <Button onClick={() => setShowForm(true)}>+ Nouveau</Button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <SearchInput
            value=""
            onChange={() => {}}
            placeholder="Rechercher un chantier..."
          />
        </div>
        <div className="w-44">
          <Select
            options={STATUT_OPTIONS}
            value={statutFilter}
            onChange={handleStatutChange}
          />
        </div>
      </div>

      {chantiers.length === 0 ? (
        <EmptyState
          icon="🏗️"
          title="Aucun chantier"
          description={
            filters.statut
              ? 'Aucun chantier ne correspond a votre filtre'
              : "Commencez par ajouter votre premier chantier"
          }
          action={
            !filters.statut
              ? { label: 'Ajouter un chantier', onClick: () => setShowForm(true) }
              : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {chantiers.map((chantier) => (
              <Card
                key={chantier.id}
                hoverable
                onClick={() => navigate(`/chantiers/${chantier.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {chantier.adresse}
                    </div>
                    <div className="text-sm text-gray-500">
                      {chantier.codePostal} {chantier.ville}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {chantier.typePrestation.join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Badge variant={STATUT_BADGES[chantier.statut].variant}>
                      {STATUT_BADGES[chantier.statut].label}
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

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nouveau chantier"
        size="lg"
      >
        <ChantierForm
          clients={clients}
          onSubmit={handleCreateChantier}
          onCancel={() => setShowForm(false)}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
}
