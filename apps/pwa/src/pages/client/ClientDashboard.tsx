import { useEffect, useState } from 'react';
import { useClientAuthStore } from '@/stores/clientAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { clientPortalApiService } from '@/api/clientPortal';

interface DashboardStats {
  devis: {
    enAttente: number;
    acceptes: number;
    total: number;
  };
  factures: {
    aPayer: number;
    payees: number;
    montantDu: number;
  };
  chantiers: Array<{
    id: string;
    description: string;
    statut: string;
    adresse: string;
  }>;
}

export function ClientDashboard() {
  const { client, logout } = useClientAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await clientPortalApiService.getDashboard();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/client/login');
  };

  const clientName = client?.prenom
    ? `${client.prenom} ${client.nom}`
    : client?.nom || 'Client';

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const statutLabels: Record<string, string> = {
    accepte: 'Accepte',
    planifie: 'Planifie',
    en_cours: 'En cours',
    termine: 'Termine',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Art & Jardin</h1>
              <p className="text-sm text-gray-500">Espace Client</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{clientName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bienvenue, {clientName}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon="📋"
                title="Devis"
                value={stats?.devis.total || 0}
                subtitle={`${stats?.devis.enAttente || 0} en attente`}
                color="blue"
              />
              <StatCard
                icon="🧾"
                title="Factures"
                value={stats?.factures.aPayer || 0}
                subtitle="a payer"
                color="orange"
              />
              <StatCard
                icon="💰"
                title="Montant du"
                value={formatCurrency(stats?.factures.montantDu || 0)}
                subtitle="total"
                color="red"
              />
              <StatCard
                icon="🏗️"
                title="Chantiers"
                value={stats?.chantiers.length || 0}
                subtitle="en cours"
                color="green"
              />
            </div>

            {stats && stats.chantiers.length > 0 && (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Chantiers en cours</h3>
                </div>
                <div className="divide-y">
                  {stats.chantiers.map((chantier) => (
                    <div key={chantier.id} className="px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{chantier.description}</p>
                          <p className="text-sm text-gray-500">{chantier.adresse}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          chantier.statut === 'en_cours'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {statutLabels[chantier.statut] || chantier.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickAccessCard
                icon="📋"
                title="Mes Devis"
                description="Consultez et signez vos devis"
                onClick={() => navigate('/client/devis')}
              />
              <QuickAccessCard
                icon="🧾"
                title="Mes Factures"
                description="Consultez et telechargez vos factures"
                onClick={() => navigate('/client/factures')}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  title: string;
  value: number | string;
  subtitle: string;
  color: 'blue' | 'orange' | 'red' | 'green';
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

interface QuickAccessCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickAccessCard({ icon, title, description, onClick }: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow w-full"
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-3 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </button>
  );
}
