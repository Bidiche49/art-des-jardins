import { apiClient } from './client';

export interface DashboardKPIs {
  revenue: {
    currentMonth: number;
    yearToDate: number;
    previousYear: number;
  };
  devis: {
    total: number;
    accepted: number;
    conversionRate: number;
    totalAmount: number;
    acceptedAmount: number;
  };
  interventions: {
    completed: number;
    planned: number;
    total: number;
  };
  clients: {
    new: number;
    active: number;
    total: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

export const analyticsApi = {
  getDashboard: async (year?: number, month?: number): Promise<DashboardKPIs> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get(`/analytics/dashboard${query}`);
    return response.data;
  },
};
