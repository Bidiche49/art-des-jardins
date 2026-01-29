import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Facture, CreateFactureDto, UpdateFactureDto } from '@art-et-jardin/shared';
import { facturesApi, type FactureFilters } from '@/api';

interface FacturesState {
  factures: Facture[];
  selectedFacture: Facture | null;
  filters: FactureFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchFactures: () => Promise<void>;
  fetchFactureById: (id: string) => Promise<Facture | null>;
  createFacture: (data: CreateFactureDto) => Promise<Facture>;
  updateFacture: (id: string, data: UpdateFactureDto) => Promise<Facture>;
  deleteFacture: (id: string) => Promise<void>;
  sendFacture: (id: string, email?: string) => Promise<void>;
  markAsPaid: (
    id: string,
    data: { modePaiement: string; referencePaiement?: string }
  ) => Promise<Facture>;
  downloadPdf: (id: string) => Promise<Blob>;
  setFilters: (filters: FactureFilters) => void;
  setPage: (page: number) => void;
  selectFacture: (facture: Facture | null) => void;
  clearError: () => void;
}

export const useFacturesStore = create<FacturesState>()(
  persist(
    (set, get) => ({
      factures: [],
      selectedFacture: null,
      filters: {},
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },

      fetchFactures: async () => {
        set({ isLoading: true, error: null });
        try {
          const { pagination, filters } = get();
          const response = await facturesApi.getAll({
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
          });
          set({
            factures: response.data,
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

      fetchFactureById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const facture = await facturesApi.getById(id);
          set({ selectedFacture: facture, isLoading: false });
          return facture;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Facture introuvable',
            isLoading: false,
          });
          return null;
        }
      },

      createFacture: async (data: CreateFactureDto) => {
        set({ isLoading: true, error: null });
        try {
          const facture = await facturesApi.create(data);
          set((state) => ({
            factures: [facture, ...state.factures],
            isLoading: false,
          }));
          return facture;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de création',
            isLoading: false,
          });
          throw error;
        }
      },

      updateFacture: async (id: string, data: UpdateFactureDto) => {
        set({ isLoading: true, error: null });
        try {
          const facture = await facturesApi.update(id, data);
          set((state) => ({
            factures: state.factures.map((f) => (f.id === id ? facture : f)),
            selectedFacture:
              state.selectedFacture?.id === id ? facture : state.selectedFacture,
            isLoading: false,
          }));
          return facture;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de mise à jour',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteFacture: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await facturesApi.delete(id);
          set((state) => ({
            factures: state.factures.filter((f) => f.id !== id),
            selectedFacture:
              state.selectedFacture?.id === id ? null : state.selectedFacture,
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

      sendFacture: async (id: string, email?: string) => {
        set({ isLoading: true, error: null });
        try {
          await facturesApi.send(id, email);
          const facture = await facturesApi.getById(id);
          set((state) => ({
            factures: state.factures.map((f) => (f.id === id ? facture : f)),
            selectedFacture:
              state.selectedFacture?.id === id ? facture : state.selectedFacture,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur d'envoi",
            isLoading: false,
          });
          throw error;
        }
      },

      markAsPaid: async (
        id: string,
        data: { modePaiement: string; referencePaiement?: string }
      ) => {
        set({ isLoading: true, error: null });
        try {
          const facture = await facturesApi.markAsPaid(id, data);
          set((state) => ({
            factures: state.factures.map((f) => (f.id === id ? facture : f)),
            selectedFacture:
              state.selectedFacture?.id === id ? facture : state.selectedFacture,
            isLoading: false,
          }));
          return facture;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de paiement',
            isLoading: false,
          });
          throw error;
        }
      },

      downloadPdf: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const blob = await facturesApi.getPdf(id);
          set({ isLoading: false });
          return blob;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de téléchargement',
            isLoading: false,
          });
          throw error;
        }
      },

      setFilters: (filters: FactureFilters) => {
        set((state) => ({
          filters,
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchFactures();
      },

      setPage: (page: number) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchFactures();
      },

      selectFacture: (facture: Facture | null) => {
        set({ selectedFacture: facture });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'factures-storage',
      partialize: (state) => ({
        factures: state.factures,
        filters: state.filters,
      }),
    }
  )
);
