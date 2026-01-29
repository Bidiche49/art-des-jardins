import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { statsApi, type DashboardStats, type InterventionAVenir, type ChiffreAffairesMensuel } from '@/api';
import { Card, CardTitle, LoadingOverlay, Button } from '@/components/ui';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [interventions, setInterventions] = useState<InterventionAVenir[]>([]);
  const [caData, setCaData] = useState<ChiffreAffairesMensuel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, interventionsData, caDataResult] = await Promise.all([
          statsApi.getDashboard(),
          statsApi.getInterventionsAVenir(7),
          statsApi.getChiffreAffaires(),
        ]);
        setStats(statsData);
        setInterventions(interventionsData);
        setCaData(caDataResult);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingOverlay message="Chargement du dashboard..." />;
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.prenom} !
        </h1>
        <p className="text-gray-600">Voici un apercu de votre activite</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card onClick={() => navigate('/clients')} hoverable>
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold">{stats?.clientsTotal || 0}</div>
          <div className="text-sm text-gray-600">Clients</div>
        </Card>
        <Card onClick={() => navigate('/chantiers')} hoverable>
          <div className="text-3xl mb-2">🏗️</div>
          <div className="text-2xl font-bold">{stats?.chantiersEnCours || 0}</div>
          <div className="text-sm text-gray-600">Chantiers en cours</div>
        </Card>
        <Card onClick={() => navigate('/devis')} hoverable>
          <div className="text-3xl mb-2">📋</div>
          <div className="text-2xl font-bold">{stats?.devisEnAttente || 0}</div>
          <div className="text-sm text-gray-600">Devis en attente</div>
        </Card>
        <Card onClick={() => navigate('/factures')} hoverable>
          <div className="text-3xl mb-2">💶</div>
          <div className="text-2xl font-bold">
            {formatCurrency(stats?.caMois || 0)} €
          </div>
          <div className="text-sm text-gray-600">CA du mois</div>
        </Card>
      </div>

      {stats?.facturesImpayees && stats.facturesImpayees > 0 && (
        <Card
          onClick={() => navigate('/factures?statut=envoyee')}
          hoverable
          className="bg-yellow-50 border-yellow-200"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="font-semibold text-yellow-800">
                {stats.facturesImpayees} facture(s) impayee(s)
              </div>
              <div className="text-sm text-yellow-600">
                Cliquez pour voir les details
              </div>
            </div>
          </div>
        </Card>
      )}

      {caData.length > 0 && (
        <Card>
          <CardTitle>Chiffre d'affaires {new Date().getFullYear()}</CardTitle>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caData}>
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.substring(0, 3)}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} €`, 'CA']}
                />
                <Bar
                  dataKey="ca"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-gray-600">Total annee</span>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(stats?.caAnnee || 0)} €
            </span>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Prochaines interventions</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/interventions')}
          >
            Voir tout
          </Button>
        </div>

        {interventions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Aucune intervention planifiee cette semaine
          </p>
        ) : (
          <div className="space-y-3">
            {interventions.slice(0, 5).map((intervention) => (
              <div
                key={intervention.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <div className="font-medium">{intervention.description}</div>
                  <div className="text-sm text-gray-600">
                    {intervention.clientNom} - {intervention.clientVille}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(intervention.date), 'EEEE dd', { locale: fr })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex-col"
          onClick={() => navigate('/devis/nouveau')}
        >
          <span className="text-2xl mb-1">📝</span>
          <span>Nouveau devis</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex-col"
          onClick={() => navigate('/clients')}
        >
          <span className="text-2xl mb-1">➕</span>
          <span>Nouveau client</span>
        </Button>
      </div>
    </div>
  );
}
