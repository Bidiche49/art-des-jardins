import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  financeReportsApi,
  FinancialSummary,
  RevenueByPeriod,
  RevenueByClient,
  UnpaidInvoice,
  ForecastItem,
} from '@/api/financeReports';

type TabType = 'summary' | 'clients' | 'unpaid' | 'forecast';

export function FinanceReports() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [revenueByPeriod, setRevenueByPeriod] = useState<RevenueByPeriod[]>([]);
  const [revenueByClient, setRevenueByClient] = useState<RevenueByClient[]>([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState<UnpaidInvoice[]>([]);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);

  useEffect(() => {
    loadData();
  }, [year]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summ, period, clients, unpaid, fore] = await Promise.all([
        financeReportsApi.getSummary(year),
        financeReportsApi.getRevenueByPeriod(year),
        financeReportsApi.getRevenueByClient(year),
        financeReportsApi.getUnpaidInvoices(),
        financeReportsApi.getForecast(),
      ]);
      setSummary(summ);
      setRevenueByPeriod(period);
      setRevenueByClient(clients);
      setUnpaidInvoices(unpaid);
      setForecast(fore);
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR');

  const tabs = [
    { id: 'summary' as TabType, label: 'Resume' },
    { id: 'clients' as TabType, label: 'Par client' },
    { id: 'unpaid' as TabType, label: 'Impayes', badge: unpaidInvoices.length },
    { id: 'forecast' as TabType, label: 'Previsionnel', badge: forecast.length },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to="/analytics"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Rapports financiers</h1>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Encaisse"
            amount={summary.paid.amount}
            count={summary.paid.count}
            color="green"
          />
          <SummaryCard
            title="En attente"
            amount={summary.pending.amount}
            count={summary.pending.count}
            color="blue"
          />
          <SummaryCard
            title="Impayes (retard)"
            amount={summary.unpaidOverdue.amount}
            count={summary.unpaidOverdue.count}
            color="red"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'summary' && (
            <RevenueTable data={revenueByPeriod} formatCurrency={formatCurrency} />
          )}
          {activeTab === 'clients' && (
            <ClientsTable data={revenueByClient} formatCurrency={formatCurrency} />
          )}
          {activeTab === 'unpaid' && (
            <UnpaidTable data={unpaidInvoices} formatCurrency={formatCurrency} formatDate={formatDate} />
          )}
          {activeTab === 'forecast' && (
            <ForecastTable data={forecast} formatCurrency={formatCurrency} formatDate={formatDate} />
          )}
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  count: number;
  color: 'green' | 'blue' | 'red';
}

function SummaryCard({ title, amount, count, color }: SummaryCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const formatCurrency = (a: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(a);

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{formatCurrency(amount)}</p>
      <p className="text-xs mt-1">{count} factures</p>
    </div>
  );
}

function RevenueTable({ data, formatCurrency }: { data: RevenueByPeriod[]; formatCurrency: (n: number) => string }) {
  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Periode</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">CA</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Factures</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.period} className="border-b last:border-0">
              <td className="py-3 px-2">{row.period}</td>
              <td className="py-3 px-2 text-right font-medium">{formatCurrency(row.revenue)}</td>
              <td className="py-3 px-2 text-right text-gray-500">{row.count}</td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td className="py-3 px-2">Total</td>
            <td className="py-3 px-2 text-right">{formatCurrency(total)}</td>
            <td className="py-3 px-2 text-right">{data.reduce((s, d) => s + d.count, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ClientsTable({ data, formatCurrency }: { data: RevenueByClient[]; formatCurrency: (n: number) => string }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Client</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">CA</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Factures</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 20).map((row) => (
            <tr key={row.clientId} className="border-b last:border-0">
              <td className="py-3 px-2">{row.clientName}</td>
              <td className="py-3 px-2 text-right font-medium">{formatCurrency(row.revenue)}</td>
              <td className="py-3 px-2 text-right text-gray-500">{row.invoiceCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 20 && (
        <p className="text-sm text-gray-500 mt-4">Affichage des 20 premiers clients</p>
      )}
    </div>
  );
}

function UnpaidTable({ data, formatCurrency, formatDate }: {
  data: UnpaidInvoice[];
  formatCurrency: (n: number) => string;
  formatDate: (d: string) => string;
}) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-8">Aucune facture impayee en retard</p>;
  }

  const total = data.reduce((sum, d) => sum + d.totalTTC, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Facture</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Client</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Montant</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Echeance</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Retard</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              <td className="py-3 px-2 font-medium">{row.numero}</td>
              <td className="py-3 px-2">{row.clientName}</td>
              <td className="py-3 px-2 text-right">{formatCurrency(row.totalTTC)}</td>
              <td className="py-3 px-2 text-right">{formatDate(row.dateEcheance)}</td>
              <td className="py-3 px-2 text-right text-red-600 font-medium">{row.daysOverdue}j</td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td colSpan={2} className="py-3 px-2">Total impayes</td>
            <td className="py-3 px-2 text-right text-red-600">{formatCurrency(total)}</td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ForecastTable({ data, formatCurrency, formatDate }: {
  data: ForecastItem[];
  formatCurrency: (n: number) => string;
  formatDate: (d: string) => string;
}) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-8">Aucun devis accepte en attente de facturation</p>;
  }

  const total = data.reduce((sum, d) => sum + d.totalTTC, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Devis</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Client</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Montant</th>
            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Accepte le</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              <td className="py-3 px-2 font-medium">{row.devisNumero}</td>
              <td className="py-3 px-2">{row.clientName}</td>
              <td className="py-3 px-2 text-right">{formatCurrency(row.totalTTC)}</td>
              <td className="py-3 px-2 text-right">{formatDate(row.dateAcceptation)}</td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td colSpan={2} className="py-3 px-2">Total previsionnel</td>
            <td className="py-3 px-2 text-right text-green-600">{formatCurrency(total)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
