import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClientUser {
  id: string;
  email: string;
  nom: string;
  prenom: string | null;
  type: 'particulier' | 'professionnel' | 'syndic';
}

interface ClientAuthState {
  client: ClientUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (client: ClientUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useClientAuthStore = create<ClientAuthState>()(
  persist(
    (set) => ({
      client: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: (client, accessToken, refreshToken) => {
        set({
          client,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          client: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'client-auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    }
  )
);
