import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';
import { clientPortalApiService } from '@/api/clientPortal';
import { Button } from '@/components/ui';

interface Intervention {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string | null;
  description: string | null;
  photos: string[];
  valide: boolean;
}

interface Chantier {
  id: string;
  description: string;
  adresse: string;
  codePostal: string;
  ville: string;
  statut: string;
  dateDebut: string | null;
  dateFin: string | null;
  photos?: string[];
  interventions?: Intervention[];
}

export function ClientChantierDetail() {
  const { id } = useParams<{ id: string }>();
  const { client, logout } = useClientAuthStore();
  const navigate = useNavigate();
  const [chantier, setChantier] = useState<Chantier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChantier = async () => {
      if (!id) return;
      try {
        const data = await clientPortalApiService.getChantierById(id);
        setChantier(data);
      } catch (err) {
        console.error('Failed to load chantier:', err);
      } finally {
        setLoading(false);
      }
    };
    loadChantier();
  }, [id]);

  const clientName = client?.prenom
    ? `${client.prenom} ${client.nom}`
    : client?.nom || 'Client';

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const statutLabels: Record<string, { label: string; color: string }> = {
    lead: { label: 'Nouveau', color: 'bg-gray-100 text-gray-800' },
    visite_planifiee: { label: 'Visite planifiee', color: 'bg-blue-100 text-blue-800' },
    devis_envoye: { label: 'Devis envoye', color: 'bg-yellow-100 text-yellow-800' },
    accepte: { label: 'Accepte', color: 'bg-green-100 text-green-800' },
    planifie: { label: 'Planifie', color: 'bg-blue-100 text-blue-800' },
    en_cours: { label: 'En cours', color: 'bg-green-100 text-green-800' },
    termine: { label: 'Termine', color: 'bg-gray-100 text-gray-800' },
    facture: { label: 'Facture', color: 'bg-purple-100 text-purple-800' },
    annule: { label: 'Annule', color: 'bg-red-100 text-red-800' },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!chantier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-4xl">❌</span>
          <p className="mt-4 text-gray-600">Chantier non trouve</p>
          <Button onClick={() => navigate('/client/chantiers')} className="mt-4">
            Retour aux chantiers
          </Button>
        </div>
      </div>
    );
  }

  const interventions = chantier.interventions || [];

  const pastInterventions = interventions
    .filter((i) => new Date(i.date) <= new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const futureInterventions = interventions
    .filter((i) => new Date(i.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/client/chantiers')} className="text-gray-500 hover:text-gray-700">
              ← Retour
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Detail chantier</h1>
              <p className="text-sm text-gray-500">Art & Jardin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{clientName}</span>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/client/login'); }}>
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{chantier.description}</h2>
              <p className="text-gray-500 mt-1">
                📍 {chantier.adresse}, {chantier.codePostal} {chantier.ville}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${statutLabels[chantier.statut]?.color || 'bg-gray-100'}`}>
              {statutLabels[chantier.statut]?.label || chantier.statut}
            </span>
          </div>

          {(chantier.dateDebut || chantier.dateFin) && (
            <div className="flex space-x-6 text-sm text-gray-600">
              {chantier.dateDebut && (
                <div>
                  <span className="font-medium">Debut:</span> {formatDate(chantier.dateDebut)}
                </div>
              )}
              {chantier.dateFin && (
                <div>
                  <span className="font-medium">Fin:</span> {formatDate(chantier.dateFin)}
                </div>
              )}
            </div>
          )}
        </div>

        {futureInterventions.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Interventions a venir</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {futureInterventions.map((intervention) => (
                  <div key={intervention.id} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">📅</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formatDate(intervention.date)}</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(intervention.heureDebut)}
                        {intervention.heureFin && ` - ${formatTime(intervention.heureFin)}`}
                      </p>
                      {intervention.description && (
                        <p className="text-sm text-gray-500 mt-1">{intervention.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Historique des interventions ({pastInterventions.length})
            </h3>
          </div>
          <div className="p-6">
            {pastInterventions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune intervention realisee pour le moment</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {pastInterventions.map((intervention) => (
                    <div key={intervention.id} className="relative pl-10">
                      <div className="absolute left-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{formatDate(intervention.date)}</p>
                            <p className="text-sm text-gray-600">
                              {formatTime(intervention.heureDebut)}
                              {intervention.heureFin && ` - ${formatTime(intervention.heureFin)}`}
                            </p>
                          </div>
                          {intervention.valide && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Valide</span>
                          )}
                        </div>
                        {intervention.description && (
                          <p className="text-sm text-gray-600 mt-2">{intervention.description}</p>
                        )}
                        {intervention.photos.length > 0 && (
                          <div className="mt-3 flex space-x-2 overflow-x-auto">
                            {intervention.photos.map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`Photo ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
