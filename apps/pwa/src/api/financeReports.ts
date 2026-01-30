import { apiClient } from './client';

export interface FinancialSummary {
  paid: { amount: number; count: number };
  pending: { amount: number; count: number };
  unpaidOverdue: { amount: number; count: number };
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  count: number;
}

export interface RevenueByClient {
  clientId: string;
  clientName: string;
  revenue: number;
  invoiceCount: number;
}

export interface RevenueByPrestation {
  prestation: string;
  revenue: number;
  count: number;
}

export interface UnpaidInvoice {
  id: string;
  numero: string;
  clientName: string;
  totalTTC: number;
  dateEcheance: string;
  daysOverdue: number;
}

export interface ForecastItem {
  id: string;
  devisNumero: string;
  clientName: string;
  totalTTC: number;
  dateAcceptation: string;
}

export const financeReportsApi = {
  getSummary: async (year?: number): Promise<FinancialSummary> => {
    const query = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/analytics/finance/summary${query}`);
    return response.data;
  },

  getRevenueByPeriod: async (year?: number): Promise<RevenueByPeriod[]> => {
    const query = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/analytics/finance/revenue-by-period${query}`);
    return response.data;
  },

  getRevenueByClient: async (year?: number): Promise<RevenueByClient[]> => {
    const query = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/analytics/finance/revenue-by-client${query}`);
    return response.data;
  },

  getRevenueByPrestation: async (year?: number): Promise<RevenueByPrestation[]> => {
    const query = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/analytics/finance/revenue-by-prestation${query}`);
    return response.data;
  },

  getUnpaidInvoices: async (): Promise<UnpaidInvoice[]> => {
    const response = await apiClient.get('/analytics/finance/unpaid');
    return response.data;
  },

  getForecast: async (): Promise<ForecastItem[]> => {
    const response = await apiClient.get('/analytics/finance/forecast');
    return response.data;
  },
};
