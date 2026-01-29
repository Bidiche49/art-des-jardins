import { useEffect, useState, useCallback } from 'react';
import { absencesApi, type Absence, type CreateAbsenceDto, type AbsenceType } from '@/api';
import { useAuthStore } from '@/stores/auth';
import {
  Button,
  Card,
  Badge,
  LoadingOverlay,
  EmptyState,
  Modal,
} from '@/components/ui';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  conge: 'Conge',
  maladie: 'Maladie',
  formation: 'Formation',
  autre: 'Autre',
};

const ABSENCE_TYPE_COLORS: Record<AbsenceType, 'warning' | 'danger' | 'primary' | 'default'> = {
  conge: 'warning',
  maladie: 'danger',
  formation: 'primary',
  autre: 'default',
};

export function Absences() {
  const { user } = useAuthStore();
  const isPatron = user?.role === 'patron';

  const [absences, setAbsences] = useState<Absence[]>([]);
  const [pendingAbsences, setPendingAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mes-absences' | 'a-valider' | 'toutes'>('mes-absences');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<CreateAbsenceDto>>({
    type: 'conge',
    dateDebut: format(new Date(), 'yyyy-MM-dd'),
    dateFin: format(new Date(), 'yyyy-MM-dd'),
    motif: '',
  });

  const loadAbsences = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isPatron) {
        const [allResponse, pendingResponse] = await Promise.all([
          absencesApi.getAll({ limit: 100 }),
          absencesApi.getPending(),
        ]);
        setAbsences(allResponse.data);
        setPendingAbsences(pendingResponse.data);
      } else {
        const response = await absencesApi.getMine({ limit: 100 });
        setAbsences(response.data);
      }
    } catch (error) {
      console.error('Failed to load absences:', error);
      toast.error('Erreur lors du chargement des absences');
    } finally {
      setIsLoading(false);
    }
  }, [isPatron]);

  useEffect(() => {
    loadAbsences();
  }, [loadAbsences]);

  const handleCreateAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dateDebut || !formData.dateFin || !formData.type) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setFormLoading(true);
    try {
      await absencesApi.create({
        dateDebut: `${formData.dateDebut}T00:00:00`,
        dateFin: `${formData.dateFin}T23:59:59`,
        type: formData.type as AbsenceType,
        motif: formData.motif || undefined,
      });
      toast.success(isPatron ? 'Absence creee' : 'Demande envoyee');
      setShowForm(false);
      setFormData({
        type: 'conge',
        dateDebut: format(new Date(), 'yyyy-MM-dd'),
        dateFin: format(new Date(), 'yyyy-MM-dd'),
        motif: '',
      });
      loadAbsences();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la creation');
    } finally {
      setFormLoading(false);
    }
  };

  const handleValider = async (id: string) => {
    try {
      await absencesApi.valider(id);
      toast.success('Absence validee');
      loadAbsences();
    } catch {
      toast.error('Erreur lors de la validation');
    }
  };

  const handleRefuser = async (id: string) => {
    try {
      await absencesApi.refuser(id);
      toast.success('Absence refusee');
      loadAbsences();
    } catch {
      toast.error('Erreur lors du refus');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette absence ?')) return;
    try {
      await absencesApi.delete(id);
      toast.success('Absence supprimee');
      loadAbsences();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const getDisplayedAbsences = () => {
    if (activeTab === 'a-valider') return pendingAbsences;
    if (activeTab === 'toutes') return absences;
    // mes-absences
    return absences.filter((a) => a.userId === user?.id);
  };

  const displayedAbsences = getDisplayedAbsences();

  if (isLoading) {
    return <LoadingOverlay message="Chargement des absences..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Absences</h1>
        <Button onClick={() => setShowForm(true)}>+ Declarer</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('mes-absences')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'mes-absences'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Mes absences
        </button>
        {isPatron && (
          <>
            <button
              onClick={() => setActiveTab('a-valider')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === 'a-valider'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              A valider
              {pendingAbsences.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {pendingAbsences.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('toutes')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'toutes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Toutes
            </button>
          </>
        )}
      </div>

      {/* Absence List */}
      <div className="space-y-3">
        {displayedAbsences.length === 0 ? (
          <EmptyState
            icon="🏖️"
            title={
              activeTab === 'a-valider'
                ? 'Aucune demande en attente'
                : 'Aucune absence'
            }
            description={
              activeTab === 'a-valider'
                ? 'Toutes les demandes ont ete traitees'
                : 'Declarez votre premiere absence'
            }
            action={
              activeTab !== 'a-valider'
                ? {
                    label: 'Declarer une absence',
                    onClick: () => setShowForm(true),
                  }
                : undefined
            }
          />
        ) : (
          displayedAbsences.map((absence) => (
            <Card key={absence.id} padding="md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={ABSENCE_TYPE_COLORS[absence.type]}>
                      {ABSENCE_TYPE_LABELS[absence.type]}
                    </Badge>
                    {absence.validee ? (
                      <Badge variant="success">Validee</Badge>
                    ) : (
                      <Badge variant="warning">En attente</Badge>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-900">
                    <span className="font-medium">
                      {format(parseISO(absence.dateDebut), 'dd MMM yyyy', { locale: fr })}
                    </span>
                    {' - '}
                    <span className="font-medium">
                      {format(parseISO(absence.dateFin), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  {absence.user && activeTab !== 'mes-absences' && (
                    <div className="text-sm text-gray-600 mt-1">
                      {absence.user.prenom} {absence.user.nom}
                    </div>
                  )}
                  {absence.motif && (
                    <div className="text-sm text-gray-500 mt-1">{absence.motif}</div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isPatron && !absence.validee && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleValider(absence.id)}
                      >
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefuser(absence.id)}
                      >
                        Refuser
                      </Button>
                    </>
                  )}
                  {(isPatron || (!absence.validee && absence.userId === user?.id)) && (
                    <button
                      onClick={() => handleDelete(absence.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Absence Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Declarer une absence"
        size="md"
      >
        <form onSubmit={handleCreateAbsence} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'absence *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AbsenceType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="conge">Conge</option>
              <option value="maladie">Maladie</option>
              <option value="formation">Formation</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de debut *
              </label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin *
              </label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                min={formData.dateDebut}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motif (optionnel)
            </label>
            <textarea
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Raison de l'absence..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={formLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Envoi...' : isPatron ? 'Creer' : 'Envoyer la demande'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
