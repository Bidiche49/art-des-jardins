import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';
import { clientPortalApiService } from '@/api/clientPortal';
import { Button } from '@/components/ui';

interface Devis {
  id: string;
  numero: string;
  dateEmission: string;
  dateValidite: string;
  totalTTC: number;
  statut: string;
  chantierDescription: string;
}

export function ClientDevisList() {
  const { client, logout } = useClientAuthStore();
  const navigate = useNavigate();
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadDevis = async () => {
      try {
        const data = await clientPortalApiService.getDevis();
        setDevis(data);
      } catch (err) {
        console.error('Failed to load devis:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDevis();
  }, []);

  const clientName = client?.prenom
    ? `${client.prenom} ${client.nom}`
    : client?.nom || 'Client';

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const statutLabels: Record<string, { label: string; color: string }> = {
    brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
    envoye: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    signe: { label: 'Signe', color: 'bg-green-100 text-green-800' },
    accepte: { label: 'Accepte', color: 'bg-green-100 text-green-800' },
    refuse: { label: 'Refuse', color: 'bg-red-100 text-red-800' },
    expire: { label: 'Expire', color: 'bg-gray-100 text-gray-800' },
  };

  const filteredDevis = devis.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'en_attente') return d.statut === 'envoye';
    if (filter === 'acceptes') return ['signe', 'accepte'].includes(d.statut);
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
              <h1 className="text-lg font-semibold text-gray-900">Mes Devis</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">Mes devis</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Tous ({devis.length})
            </button>
            <button
              onClick={() => setFilter('en_attente')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'en_attente' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              En attente ({devis.filter(d => d.statut === 'envoye').length})
            </button>
            <button
              onClick={() => setFilter('acceptes')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'acceptes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Acceptes ({devis.filter(d => ['signe', 'accepte'].includes(d.statut)).length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredDevis.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <span className="text-4xl">📋</span>
            <p className="mt-4 text-gray-600">Aucun devis trouve</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numero</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chantier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevis.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.numero}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{d.chantierDescription}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(d.dateEmission)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(d.totalTTC)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${statutLabels[d.statut]?.color || 'bg-gray-100'}`}>
                          {statutLabels[d.statut]?.label || d.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => navigate(`/client/devis/${d.id}`)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Voir
                        </button>
                        {d.statut === 'envoye' && (
                          <button
                            onClick={() => navigate(`/signer/${d.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Signer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
