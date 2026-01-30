import { apiClient } from './client';

interface ClientUser {
  id: string;
  email: string;
  nom: string;
  prenom: string | null;
  type: 'particulier' | 'professionnel' | 'syndic';
}

interface ClientAuthResponse {
  client: ClientUser;
  accessToken: string;
  refreshToken: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const clientAuthApi = {
  requestMagicLink: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/client-auth/request-link', { email });
    return response.data;
  },

  verifyToken: async (token: string): Promise<ClientAuthResponse> => {
    const response = await apiClient.get(`/client-auth/verify/${token}`);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post('/client-auth/refresh', { refreshToken });
    return response.data;
  },

  me: async (): Promise<ClientUser> => {
    const response = await apiClient.get('/client-auth/me');
    return response.data;
  },
};
