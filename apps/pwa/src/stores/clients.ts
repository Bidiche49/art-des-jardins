import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Client, CreateClientDto, UpdateClientDto, ClientFilters } from '@art-et-jardin/shared';
import { clientsApi } from '@/api';

interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  filters: ClientFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchClients: () => Promise<void>;
  fetchClientById: (id: string) => Promise<Client | null>;
  createClient: (data: CreateClientDto) => Promise<Client>;
  updateClient: (id: string, data: UpdateClientDto) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  setFilters: (filters: ClientFilters) => void;
  setPage: (page: number) => void;
  selectClient: (client: Client | null) => void;
  clearError: () => void;
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      selectedClient: null,
      filters: {},
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },

      fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const { pagination, filters } = get();
          const response = await clientsApi.getAll({
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
          });
          set({
            clients: response.data,
            pagination: {
              ...pagination,
              total: response.meta.total,
              totalPages: response.meta.totalPages,
            },
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de chargement',
            isLoading: false,
          });
        }
      },

      fetchClientById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const client = await clientsApi.getById(id);
          set({ selectedClient: client, isLoading: false });
          return client;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Client introuvable',
            isLoading: false,
          });
          return null;
        }
      },

      createClient: async (data: CreateClientDto) => {
        set({ isLoading: true, error: null });
        try {
          const client = await clientsApi.create(data);
          set((state) => ({
            clients: [client, ...state.clients],
            isLoading: false,
          }));
          return client;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de création',
            isLoading: false,
          });
          throw error;
        }
      },

      updateClient: async (id: string, data: UpdateClientDto) => {
        set({ isLoading: true, error: null });
        try {
          const client = await clientsApi.update(id, data);
          set((state) => ({
            clients: state.clients.map((c) => (c.id === id ? client : c)),
            selectedClient:
              state.selectedClient?.id === id ? client : state.selectedClient,
            isLoading: false,
          }));
          return client;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de mise à jour',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteClient: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await clientsApi.delete(id);
          set((state) => ({
            clients: state.clients.filter((c) => c.id !== id),
            selectedClient:
              state.selectedClient?.id === id ? null : state.selectedClient,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de suppression',
            isLoading: false,
          });
          throw error;
        }
      },

      setFilters: (filters: ClientFilters) => {
        set((state) => ({
          filters,
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchClients();
      },

      setPage: (page: number) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchClients();
      },

      selectClient: (client: Client | null) => {
        set({ selectedClient: client });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'clients-storage',
      partialize: (state) => ({
        clients: state.clients,
        filters: state.filters,
      }),
    }
  )
);
