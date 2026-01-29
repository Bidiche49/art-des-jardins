import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChantiersStore, useClientsStore, useInterventionsStore, useDevisStore } from '@/stores';
import {
  Button,
  Card,
  CardTitle,
  Badge,
  LoadingOverlay,
  Modal,
  EmptyState,
  Select,
} from '@/components/ui';
import { ChantierForm, InterventionForm } from '@/components/forms';
import type { ChantierFormData, InterventionFormData } from '@/lib/validations';
import type { ChantierStatut, Devis } from '@art-et-jardin/shared';
import type { Intervention } from '@/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const STATUT_BADGES: Record<ChantierStatut, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }> = {
  lead: { label: 'Lead', variant: 'default' },
  visite_planifiee: { label: 'Visite planifiee', variant: 'info' },
  devis_envoye: { label: 'Devis envoye', variant: 'warning' },
  accepte: { label: 'Accepte', variant: 'success' },
  planifie: { label: 'Planifie', variant: 'info' },
  en_cours: { label: 'En cours', variant: 'primary' },
  termine: { label: 'Termine', variant: 'success' },
  facture: { label: 'Facture', variant: 'success' },
  annule: { label: 'Annule', variant: 'danger' },
};

const STATUT_OPTIONS = Object.entries(STATUT_BADGES).map(([value, { label }]) => ({
  value,
  label,
}));

export function ChantierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedChantier,
    isLoading,
    fetchChantierById,
    updateChantier,
    deleteChantier,
  } = useChantiersStore();
  const { clients, fetchClients, selectedClient, fetchClientById } = useClientsStore();
  const { createIntervention, fetchInterventionsByChantier } = useInterventionsStore();
  const { fetchDevisByChantier } = useDevisStore();

  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showInterventionForm, setShowInterventionForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchChantierById(id);
      fetchInterventionsByChantier(id).then(setInterventions);
      fetchDevisByChantier(id).then(setDevisList);
      fetchClients();
    }
  }, [id, fetchChantierById, fetchInterventionsByChantier, fetchDevisByChantier, fetchClients]);

  useEffect(() => {
    if (selectedChantier?.clientId) {
      fetchClientById(selectedChantier.clientId);
    }
  }, [selectedChantier?.clientId, fetchClientById]);

  const handleUpdate = async (data: ChantierFormData) => {
    if (!id) return;
    setFormLoading(true);
    try {
      await updateChantier(id, data);
      toast.success('Chantier modifie avec succes');
      setShowEditForm(false);
    } catch {
      toast.error('Erreur lors de la modification');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatutChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!id) return;
    const newStatut = e.target.value as ChantierStatut;
    try {
      await updateChantier(id, { statut: newStatut });
      toast.success('Statut mis a jour');
    } catch {
      toast.error('Erreur lors de la mise a jour du statut');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setFormLoading(true);
    try {
      await deleteChantier(id);
      toast.success('Chantier supprime');
      navigate('/chantiers');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setFormLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCreateIntervention = async (data: InterventionFormData) => {
    setFormLoading(true);
    try {
      await createIntervention(data);
      toast.success('Intervention planifiee');
      setShowInterventionForm(false);
      if (id) {
        const updated = await fetchInterventionsByChantier(id);
        setInterventions(updated);
      }
    } catch {
      toast.error("Erreur lors de la planification");
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading || !selectedChantier) {
    return <LoadingOverlay message="Chargement du chantier..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/chantiers')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{selectedChantier.adresse}</h1>
          <p className="text-gray-500">
            {selectedChantier.codePostal} {selectedChantier.ville}
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowEditForm(true)}>
          Modifier
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select
          options={STATUT_OPTIONS}
          value={selectedChantier.statut}
          onChange={handleStatutChange}
          className="w-48"
        />
        <Badge variant={STATUT_BADGES[selectedChantier.statut].variant} size="md">
          {STATUT_BADGES[selectedChantier.statut].label}
        </Badge>
      </div>

      {selectedClient && (
        <Card onClick={() => navigate(`/clients/${selectedClient.id}`)} hoverable>
          <div className="flex items-center gap-3">
            <div className="text-2xl">👤</div>
            <div>
              <div className="font-medium">
                {selectedClient.type === 'particulier'
                  ? `${selectedClient.prenom} ${selectedClient.nom}`
                  : selectedClient.raisonSociale || selectedClient.nom}
              </div>
              <div className="text-sm text-gray-500">{selectedClient.telephone}</div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardTitle>Details</CardTitle>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-gray-500 text-sm">Types de prestation</dt>
            <dd className="flex flex-wrap gap-1 mt-1">
              {selectedChantier.typePrestation.map((type) => (
                <Badge key={type}>{type}</Badge>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 text-sm">Description</dt>
            <dd className="mt-1">{selectedChantier.description}</dd>
          </div>
          {selectedChantier.surface && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Surface</dt>
              <dd>{selectedChantier.surface} m²</dd>
            </div>
          )}
          {selectedChantier.dateVisite && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Date de visite</dt>
              <dd>{format(new Date(selectedChantier.dateVisite), 'dd MMMM yyyy', { locale: fr })}</dd>
            </div>
          )}
          {selectedChantier.notes && (
            <div className="pt-3 border-t">
              <dt className="text-gray-500 mb-1">Notes</dt>
              <dd className="text-gray-700 whitespace-pre-wrap">{selectedChantier.notes}</dd>
            </div>
          )}
        </dl>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Interventions ({interventions.length})</h2>
          <Button size="sm" onClick={() => setShowInterventionForm(true)}>
            + Planifier
          </Button>
        </div>

        {interventions.length === 0 ? (
          <EmptyState
            icon="📅"
            title="Aucune intervention"
            description="Planifiez votre premiere intervention"
            action={{
              label: 'Planifier',
              onClick: () => setShowInterventionForm(true),
            }}
          />
        ) : (
          <div className="space-y-2">
            {interventions.map((intervention) => (
              <Card key={intervention.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {format(new Date(intervention.date), 'EEEE dd MMMM', { locale: fr })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {intervention.heureDebut}
                      {intervention.heureFin && ` - ${intervention.heureFin}`}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{intervention.description}</div>
                  </div>
                  <Badge
                    variant={
                      intervention.statut === 'terminee'
                        ? 'success'
                        : intervention.statut === 'en_cours'
                        ? 'primary'
                        : 'default'
                    }
                  >
                    {intervention.statut}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Devis ({devisList.length})</h2>
          <Button size="sm" onClick={() => navigate(`/devis/nouveau?chantierId=${id}`)}>
            + Nouveau devis
          </Button>
        </div>

        {devisList.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Aucun devis"
            description="Creez votre premier devis"
            action={{
              label: 'Creer un devis',
              onClick: () => navigate(`/devis/nouveau?chantierId=${id}`),
            }}
          />
        ) : (
          <div className="space-y-2">
            {devisList.map((devis) => (
              <Card
                key={devis.id}
                hoverable
                onClick={() => navigate(`/devis/${devis.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{devis.numero}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(devis.dateEmission), 'dd/MM/yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{devis.totalTTC.toFixed(2)} €</div>
                    <Badge
                      variant={
                        devis.statut === 'accepte'
                          ? 'success'
                          : devis.statut === 'refuse'
                          ? 'danger'
                          : devis.statut === 'envoye'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {devis.statut}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t">
        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
          Supprimer ce chantier
        </Button>
      </div>

      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Modifier le chantier"
        size="lg"
      >
        <ChantierForm
          chantier={selectedChantier}
          clients={clients}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditForm(false)}
          isLoading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={showInterventionForm}
        onClose={() => setShowInterventionForm(false)}
        title="Planifier une intervention"
        size="lg"
      >
        <InterventionForm
          chantiers={[selectedChantier]}
          preselectedChantierId={id}
          onSubmit={handleCreateIntervention}
          onCancel={() => setShowInterventionForm(false)}
          isLoading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirmer la suppression"
      >
        <p className="text-gray-600 mb-6">
          Etes-vous sur de vouloir supprimer ce chantier ? Cette action est irreversible.
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
