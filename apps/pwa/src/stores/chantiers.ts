import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chantier, CreateChantierDto, UpdateChantierDto, ChantierFilters } from '@art-et-jardin/shared';
import { chantiersApi } from '@/api';

interface ChantiersState {
  chantiers: Chantier[];
  selectedChantier: Chantier | null;
  filters: ChantierFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchChantiers: () => Promise<void>;
  fetchChantierById: (id: string) => Promise<Chantier | null>;
  fetchChantiersByClient: (clientId: string) => Promise<Chantier[]>;
  createChantier: (data: CreateChantierDto) => Promise<Chantier>;
  updateChantier: (id: string, data: UpdateChantierDto) => Promise<Chantier>;
  deleteChantier: (id: string) => Promise<void>;
  addPhoto: (id: string, photoUrl: string) => Promise<void>;
  removePhoto: (id: string, photoUrl: string) => Promise<void>;
  setFilters: (filters: ChantierFilters) => void;
  setPage: (page: number) => void;
  selectChantier: (chantier: Chantier | null) => void;
  clearError: () => void;
}

export const useChantiersStore = create<ChantiersState>()(
  persist(
    (set, get) => ({
      chantiers: [],
      selectedChantier: null,
      filters: {},
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },

      fetchChantiers: async () => {
        set({ isLoading: true, error: null });
        try {
          const { pagination, filters } = get();
          const response = await chantiersApi.getAll({
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
          });
          set({
            chantiers: response.data,
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

      fetchChantierById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const chantier = await chantiersApi.getById(id);
          set({ selectedChantier: chantier, isLoading: false });
          return chantier;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Chantier introuvable',
            isLoading: false,
          });
          return null;
        }
      },

      fetchChantiersByClient: async (clientId: string) => {
        set({ isLoading: true, error: null });
        try {
          const chantiers = await chantiersApi.getByClient(clientId);
          set({ isLoading: false });
          return chantiers;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de chargement',
            isLoading: false,
          });
          return [];
        }
      },

      createChantier: async (data: CreateChantierDto) => {
        set({ isLoading: true, error: null });
        try {
          const chantier = await chantiersApi.create(data);
          set((state) => ({
            chantiers: [chantier, ...state.chantiers],
            isLoading: false,
          }));
          return chantier;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de création',
            isLoading: false,
          });
          throw error;
        }
      },

      updateChantier: async (id: string, data: UpdateChantierDto) => {
        set({ isLoading: true, error: null });
        try {
          const chantier = await chantiersApi.update(id, data);
          set((state) => ({
            chantiers: state.chantiers.map((c) => (c.id === id ? chantier : c)),
            selectedChantier:
              state.selectedChantier?.id === id ? chantier : state.selectedChantier,
            isLoading: false,
          }));
          return chantier;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de mise à jour',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteChantier: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await chantiersApi.delete(id);
          set((state) => ({
            chantiers: state.chantiers.filter((c) => c.id !== id),
            selectedChantier:
              state.selectedChantier?.id === id ? null : state.selectedChantier,
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

      addPhoto: async (id: string, photoUrl: string) => {
        try {
          const chantier = await chantiersApi.addPhoto(id, photoUrl);
          set((state) => ({
            chantiers: state.chantiers.map((c) => (c.id === id ? chantier : c)),
            selectedChantier:
              state.selectedChantier?.id === id ? chantier : state.selectedChantier,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur d'upload",
          });
          throw error;
        }
      },

      removePhoto: async (id: string, photoUrl: string) => {
        try {
          const chantier = await chantiersApi.removePhoto(id, photoUrl);
          set((state) => ({
            chantiers: state.chantiers.map((c) => (c.id === id ? chantier : c)),
            selectedChantier:
              state.selectedChantier?.id === id ? chantier : state.selectedChantier,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de suppression',
          });
          throw error;
        }
      },

      setFilters: (filters: ChantierFilters) => {
        set((state) => ({
          filters,
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchChantiers();
      },

      setPage: (page: number) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchChantiers();
      },

      selectChantier: (chantier: Chantier | null) => {
        set({ selectedChantier: chantier });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'chantiers-storage',
      partialize: (state) => ({
        chantiers: state.chantiers,
        filters: state.filters,
      }),
    }
  )
);
