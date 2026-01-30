import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';
import { clientPortalApiService } from '@/api/clientPortal';
import { Button } from '@/components/ui';

interface Chantier {
  id: string;
  description: string;
  adresse: string;
  codePostal: string;
  ville: string;
  statut: string;
  dateDebut: string | null;
  dateFin: string | null;
}

export function ClientChantiersList() {
  const { client, logout } = useClientAuthStore();
  const navigate = useNavigate();
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadChantiers = async () => {
      try {
        const data = await clientPortalApiService.getChantiers();
        setChantiers(data);
      } catch (err) {
        console.error('Failed to load chantiers:', err);
      } finally {
        setLoading(false);
      }
    };
    loadChantiers();
  }, []);

  const clientName = client?.prenom
    ? `${client.prenom} ${client.nom}`
    : client?.nom || 'Client';

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

  const filteredChantiers = chantiers.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'en_cours') return ['accepte', 'planifie', 'en_cours'].includes(c.statut);
    if (filter === 'termines') return ['termine', 'facture'].includes(c.statut);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/client/dashboard')} className="text-gray-500 hover:text-gray-700">
              ← Retour
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Mes Chantiers</h1>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Mes chantiers</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Tous ({chantiers.length})
            </button>
            <button
              onClick={() => setFilter('en_cours')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'en_cours' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              En cours ({chantiers.filter(c => ['accepte', 'planifie', 'en_cours'].includes(c.statut)).length})
            </button>
            <button
              onClick={() => setFilter('termines')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'termines' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Termines ({chantiers.filter(c => ['termine', 'facture'].includes(c.statut)).length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredChantiers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <span className="text-4xl">🏗️</span>
            <p className="mt-4 text-gray-600">Aucun chantier trouve</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChantiers.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => navigate(`/client/chantiers/${c.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">{c.description}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${statutLabels[c.statut]?.color || 'bg-gray-100'}`}>
                    {statutLabels[c.statut]?.label || c.statut}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  📍 {c.adresse}, {c.codePostal} {c.ville}
                </p>
                {c.dateDebut && (
                  <p className="text-xs text-gray-400">
                    Debut: {new Date(c.dateDebut).toLocaleDateString('fr-FR')}
                    {c.dateFin && ` - Fin: ${new Date(c.dateFin).toLocaleDateString('fr-FR')}`}
                  </p>
                )}
                <button className="mt-4 text-green-600 text-sm font-medium hover:text-green-800">
                  Voir le detail →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
