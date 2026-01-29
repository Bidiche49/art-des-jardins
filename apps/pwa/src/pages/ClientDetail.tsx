import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientsStore, useChantiersStore } from '@/stores';
import {
  Button,
  Card,
  CardTitle,
  Badge,
  LoadingOverlay,
  Modal,
  EmptyState,
} from '@/components/ui';
import { ClientForm, ChantierForm } from '@/components/forms';
import type { ClientFormData, ChantierFormData } from '@/lib/validations';
import type { Client, Chantier, ChantierStatut } from '@art-et-jardin/shared';
import toast from 'react-hot-toast';

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

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedClient,
    isLoading,
    fetchClientById,
    updateClient,
    deleteClient,
  } = useClientsStore();
  const { createChantier, fetchChantiersByClient } = useChantiersStore();

  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChantierForm, setShowChantierForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClientById(id);
      fetchChantiersByClient(id).then(setChantiers);
    }
  }, [id, fetchClientById, fetchChantiersByClient]);

  const handleUpdate = async (data: ClientFormData) => {
    if (!id) return;
    setFormLoading(true);
    try {
      await updateClient(id, data);
      toast.success('Client modifie avec succes');
      setShowEditForm(false);
    } catch {
      toast.error('Erreur lors de la modification');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setFormLoading(true);
    try {
      await deleteClient(id);
      toast.success('Client supprime');
      navigate('/clients');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setFormLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCreateChantier = async (data: ChantierFormData) => {
    setFormLoading(true);
    try {
      const chantier = await createChantier(data);
      toast.success('Chantier cree avec succes');
      setShowChantierForm(false);
      navigate(`/chantiers/${chantier.id}`);
    } catch {
      toast.error('Erreur lors de la creation du chantier');
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

  if (isLoading || !selectedClient) {
    return <LoadingOverlay message="Chargement du client..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/clients')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {getClientDisplayName(selectedClient)}
          </h1>
          <Badge variant={selectedClient.type === 'particulier' ? 'default' : 'primary'}>
            {selectedClient.type}
          </Badge>
        </div>
        <Button variant="outline" onClick={() => setShowEditForm(true)}>
          Modifier
        </Button>
      </div>

      <Card>
        <CardTitle>Informations</CardTitle>
        <dl className="mt-4 space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd>
              <a href={`mailto:${selectedClient.email}`} className="text-primary-600">
                {selectedClient.email}
              </a>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Telephone</dt>
            <dd>
              <a href={`tel:${selectedClient.telephone}`} className="text-primary-600">
                {selectedClient.telephone}
              </a>
            </dd>
          </div>
          {selectedClient.telephoneSecondaire && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Tel. secondaire</dt>
              <dd>{selectedClient.telephoneSecondaire}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-gray-500">Adresse</dt>
            <dd className="text-right">
              {selectedClient.adresse}<br />
              {selectedClient.codePostal} {selectedClient.ville}
            </dd>
          </div>
          {selectedClient.notes && (
            <div className="pt-3 border-t">
              <dt className="text-gray-500 mb-1">Notes</dt>
              <dd className="text-gray-700 whitespace-pre-wrap">{selectedClient.notes}</dd>
            </div>
          )}
        </dl>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chantiers ({chantiers.length})</h2>
          <Button size="sm" onClick={() => setShowChantierForm(true)}>
            + Nouveau chantier
          </Button>
        </div>

        {chantiers.length === 0 ? (
          <EmptyState
            icon="🏗️"
            title="Aucun chantier"
            description="Ce client n'a pas encore de chantier"
            action={{
              label: 'Creer un chantier',
              onClick: () => setShowChantierForm(true),
            }}
          />
        ) : (
          <div className="space-y-2">
            {chantiers.map((chantier) => (
              <Card
                key={chantier.id}
                hoverable
                onClick={() => navigate(`/chantiers/${chantier.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{chantier.adresse}</div>
                    <div className="text-sm text-gray-500">{chantier.ville}</div>
                  </div>
                  <Badge variant={STATUT_BADGES[chantier.statut].variant}>
                    {STATUT_BADGES[chantier.statut].label}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t">
        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
          Supprimer ce client
        </Button>
      </div>

      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Modifier le client"
        size="lg"
      >
        <ClientForm
          client={selectedClient}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditForm(false)}
          isLoading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={showChantierForm}
        onClose={() => setShowChantierForm(false)}
        title="Nouveau chantier"
        size="lg"
      >
        <ChantierForm
          clients={[selectedClient]}
          onSubmit={handleCreateChantier}
          onCancel={() => setShowChantierForm(false)}
          isLoading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmer la suppression"
      >
        <p className="text-gray-600 mb-6">
          Etes-vous sur de vouloir supprimer ce client ? Cette action est irreversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={formLoading}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
