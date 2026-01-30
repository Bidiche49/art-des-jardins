import { useEffect, useState } from 'react';
import { analyticsApi, DashboardKPIs } from '@/api/analytics';

export function Analytics() {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [year]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await analyticsApi.getDashboard(year);
      setData(result);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Erreur lors du chargement des donnees
      </div>
    );
  }

  const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="CA Mois en cours"
          value={formatCurrency(data.revenue.currentMonth)}
          icon="💰"
          color="green"
        />
        <KPICard
          title="CA Annuel"
          value={formatCurrency(data.revenue.yearToDate)}
          subtitle={`N-1: ${formatCurrency(data.revenue.previousYear)}`}
          icon="📈"
          color="blue"
        />
        <KPICard
          title="Taux conversion devis"
          value={formatPercent(data.devis.conversionRate)}
          subtitle={`${data.devis.accepted}/${data.devis.total} acceptes`}
          icon="📋"
          color="purple"
        />
        <KPICard
          title="Clients actifs"
          value={data.clients.active.toString()}
          subtitle={`${data.clients.new} nouveaux cette annee`}
          icon="👥"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Chiffre d'affaires mensuel
          </h3>
          <div className="space-y-3">
            {data.monthlyRevenue.map((item) => (
              <div key={item.month} className="flex items-center space-x-3">
                <span className="w-10 text-sm text-gray-500">{item.month}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-sm text-gray-700 text-right">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activite</h3>
          <div className="space-y-4">
            <StatRow
              label="Interventions realisees"
              value={data.interventions.completed}
              total={data.interventions.total}
              color="green"
            />
            <StatRow
              label="Interventions planifiees"
              value={data.interventions.planned}
              color="blue"
            />
            <StatRow
              label="Total clients"
              value={data.clients.total}
              color="purple"
            />
            <StatRow
              label="Montant devis acceptes"
              value={formatCurrency(data.devis.acceptedAmount)}
              subtitle={`sur ${formatCurrency(data.devis.totalAmount)} emis`}
              color="orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

function KPICard({ title, value, subtitle, icon, color }: KPICardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: number | string;
  total?: number;
  subtitle?: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

function StatRow({ label, value, total, subtitle, color }: StatRowProps) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`} />
        <div>
          <span className="text-gray-700">{label}</span>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      <div className="text-right">
        <span className="font-semibold text-gray-900">{value}</span>
        {total !== undefined && (
          <span className="text-gray-400 text-sm">/{total}</span>
        )}
      </div>
    </div>
  );
}
