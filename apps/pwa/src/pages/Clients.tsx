import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientsStore } from '@/stores';
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
import { ClientForm } from '@/components/forms';
import type { ClientFormData } from '@/lib/validations';
import type { Client, ClientType } from '@art-et-jardin/shared';
import toast from 'react-hot-toast';

const CLIENT_TYPE_OPTIONS = [
  { value: '', label: 'Tous les types' },
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'syndic', label: 'Syndic' },
];

const TYPE_BADGES: Record<ClientType, { label: string; variant: 'default' | 'primary' | 'info' }> = {
  particulier: { label: 'Particulier', variant: 'default' },
  professionnel: { label: 'Pro', variant: 'primary' },
  syndic: { label: 'Syndic', variant: 'info' },
};

export function Clients() {
  const navigate = useNavigate();
  const {
    clients,
    isLoading,
    pagination,
    filters,
    fetchClients,
    createClient,
    setFilters,
    setPage,
  } = useClientsStore();

  const [search, setSearch] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState<string>(filters.type || '');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters({ ...filters, search: value || undefined });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ClientType | '';
    setTypeFilter(value);
    setFilters({ ...filters, type: value || undefined });
  };

  const handleCreateClient = async (data: ClientFormData) => {
    setFormLoading(true);
    try {
      const client = await createClient(data);
      toast.success('Client cree avec succes');
      setShowForm(false);
      navigate(`/clients/${client.id}`);
    } catch {
      toast.error('Erreur lors de la creation du client');
    } finally {
      setFormLoading(false);
    }
  };

  const getClientDisplayName = (client: Client) => {
    if (client.type === 'particulier') {
      return `${client.prenom || ''} ${client.nom}`.trim();
    }
    return client.raisonSociale || client.nom;
  };

  if (isLoading && clients.length === 0) {
    return <LoadingOverlay message="Chargement des clients..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button onClick={() => setShowForm(true)}>+ Nouveau</Button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Rechercher un client..."
          />
        </div>
        <div className="w-40">
          <Select
            options={CLIENT_TYPE_OPTIONS}
            value={typeFilter}
            onChange={handleTypeChange}
          />
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Aucun client"
          description={
            filters.search || filters.type
              ? 'Aucun client ne correspond a votre recherche'
              : "Commencez par ajouter votre premier client"
          }
          action={
            !filters.search && !filters.type
              ? { label: 'Ajouter un client', onClick: () => setShowForm(true) }
              : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {clients.map((client) => (
              <Card
                key={client.id}
                hoverable
                onClick={() => navigate(`/clients/${client.id}`)}
                className="flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">
                      {getClientDisplayName(client)}
                    </span>
                    <Badge variant={TYPE_BADGES[client.type].variant}>
                      {TYPE_BADGES[client.type].label}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {client.ville} - {client.telephone}
                  </div>
                </div>
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
        title="Nouveau client"
        size="lg"
      >
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setShowForm(false)}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
}
