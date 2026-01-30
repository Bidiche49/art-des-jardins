import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';
import { clientPortalApiService } from '@/api/clientPortal';
import { Button } from '@/components/ui';

interface Facture {
  id: string;
  numero: string;
  dateEmission: string;
  dateEcheance: string;
  totalTTC: number;
  statut: string;
  devisNumero: string;
  chantierDescription: string;
}

export function ClientFacturesList() {
  const { client, logout } = useClientAuthStore();
  const navigate = useNavigate();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadFactures = async () => {
      try {
        const data = await clientPortalApiService.getFactures();
        setFactures(data);
      } catch (err) {
        console.error('Failed to load factures:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFactures();
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
    envoyee: { label: 'A payer', color: 'bg-orange-100 text-orange-800' },
    payee: { label: 'Payee', color: 'bg-green-100 text-green-800' },
    annulee: { label: 'Annulee', color: 'bg-red-100 text-red-800' },
  };

  const filteredFactures = factures.filter((f) => {
    if (filter === 'all') return true;
    if (filter === 'a_payer') return f.statut === 'envoyee';
    if (filter === 'payees') return f.statut === 'payee';
    return true;
  });

  const isOverdue = (dateEcheance: string, statut: string) => {
    if (statut !== 'envoyee') return false;
    return new Date(dateEcheance) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/client/dashboard')} className="text-gray-500 hover:text-gray-700">
              ← Retour
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Mes Factures</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">Mes factures</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Toutes ({factures.length})
            </button>
            <button
              onClick={() => setFilter('a_payer')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'a_payer' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              A payer ({factures.filter(f => f.statut === 'envoyee').length})
            </button>
            <button
              onClick={() => setFilter('payees')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'payees' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Payees ({factures.filter(f => f.statut === 'payee').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredFactures.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <span className="text-4xl">🧾</span>
            <p className="mt-4 text-gray-600">Aucune facture trouvee</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Echeance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFactures.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.numero}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{f.chantierDescription}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(f.dateEmission)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={isOverdue(f.dateEcheance, f.statut) ? 'text-red-600 font-medium' : ''}>
                          {formatDate(f.dateEcheance)}
                          {isOverdue(f.dateEcheance, f.statut) && ' (en retard)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(f.totalTTC)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${statutLabels[f.statut]?.color || 'bg-gray-100'}`}>
                          {statutLabels[f.statut]?.label || f.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/client/factures/${f.id}`)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Voir
                        </button>
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
