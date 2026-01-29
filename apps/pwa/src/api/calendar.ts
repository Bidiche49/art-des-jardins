import apiClient from './client';

export interface IcalTokenResponse {
  token: string | null;
}

export const calendarApi = {
  getIcalToken: async (): Promise<IcalTokenResponse> => {
    const response = await apiClient.get<IcalTokenResponse>('/calendar/ical/token');
    return response.data;
  },

  generateIcalToken: async (): Promise<IcalTokenResponse> => {
    const response = await apiClient.post<IcalTokenResponse>('/calendar/ical/token');
    return response.data;
  },

  revokeIcalToken: async (): Promise<void> => {
    await apiClient.delete('/calendar/ical/token');
  },

  getIcalSubscriptionUrl: (token: string): string => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${baseUrl}/calendar/ical?token=${token}`;
  },

  getIcalDownloadUrl: (): string => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${baseUrl}/calendar/ical/download`;
  },
};

export default calendarApi;
