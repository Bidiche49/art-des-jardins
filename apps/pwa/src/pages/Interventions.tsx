import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterventionsStore, useChantiersStore } from '@/stores';
import {
  Button,
  Card,
  Badge,
  LoadingOverlay,
  EmptyState,
  Modal,
} from '@/components/ui';
import { InterventionForm } from '@/components/forms';
import type { InterventionFormData } from '@/lib/validations';
import type { InterventionStatut } from '@/api';
import { format, startOfWeek, endOfWeek, addWeeks, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const STATUT_BADGES: Record<InterventionStatut, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  planifiee: { label: 'Planifiee', variant: 'default' },
  en_cours: { label: 'En cours', variant: 'primary' },
  terminee: { label: 'Terminee', variant: 'success' },
  annulee: { label: 'Annulee', variant: 'danger' },
};

export function Interventions() {
  const navigate = useNavigate();
  const {
    interventions,
    isLoading,
    fetchInterventionsByDateRange,
    createIntervention,
  } = useInterventionsStore();
  const { chantiers, fetchChantiers } = useChantiersStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const start = currentWeekStart;
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    fetchInterventionsByDateRange(start, end);
    fetchChantiers();
  }, [currentWeekStart, fetchInterventionsByDateRange, fetchChantiers]);

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, -1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handleCreateIntervention = async (data: InterventionFormData) => {
    setFormLoading(true);
    try {
      await createIntervention(data);
      toast.success('Intervention planifiee');
      setShowForm(false);
      const start = currentWeekStart;
      const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      fetchInterventionsByDateRange(start, end);
    } catch {
      toast.error("Erreur lors de la planification");
    } finally {
      setFormLoading(false);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getInterventionsForDay = (date: Date) => {
    return interventions.filter((i) => isSameDay(new Date(i.date), date));
  };

  if (isLoading && interventions.length === 0) {
    return <LoadingOverlay message="Chargement des interventions..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Interventions</h1>
        <Button onClick={() => setShowForm(true)}>+ Planifier</Button>
      </div>

      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <div className="font-medium">
            {format(currentWeekStart, "'Semaine du' dd MMMM", { locale: fr })}
          </div>
          <button
            onClick={goToCurrentWeek}
            className="text-sm text-primary-600 hover:underline"
          >
            Aujourd'hui
          </button>
        </div>

        <button
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {weekDays.map((day) => {
          const dayInterventions = getInterventionsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day.toISOString()}>
              <div
                className={`
                  px-3 py-2 rounded-lg mb-2
                  ${isToday ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-700'}
                `}
              >
                <span className="font-medium">
                  {format(day, 'EEEE dd MMMM', { locale: fr })}
                </span>
                {isToday && <span className="ml-2 text-sm">(Aujourd'hui)</span>}
              </div>

              {dayInterventions.length === 0 ? (
                <p className="text-gray-400 text-sm pl-3 py-2">Aucune intervention</p>
              ) : (
                <div className="space-y-2 pl-2">
                  {dayInterventions.map((intervention) => (
                    <Card
                      key={intervention.id}
                      hoverable
                      onClick={() => navigate(`/interventions/${intervention.id}`)}
                      padding="sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {intervention.heureDebut}
                              {intervention.heureFin && ` - ${intervention.heureFin}`}
                            </span>
                            <Badge variant={STATUT_BADGES[intervention.statut].variant}>
                              {STATUT_BADGES[intervention.statut].label}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {intervention.description}
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2"
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
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {interventions.length === 0 && (
        <EmptyState
          icon="📅"
          title="Aucune intervention cette semaine"
          description="Planifiez votre premiere intervention"
          action={{
            label: 'Planifier',
            onClick: () => setShowForm(true),
          }}
        />
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Planifier une intervention"
        size="lg"
      >
        <InterventionForm
          chantiers={chantiers}
          onSubmit={handleCreateIntervention}
          onCancel={() => setShowForm(false)}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
}
