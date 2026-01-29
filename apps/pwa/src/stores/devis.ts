import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Devis, CreateDevisDto, UpdateDevisDto } from '@art-et-jardin/shared';
import { devisApi, type DevisFilters } from '@/api';

interface DevisState {
  devisList: Devis[];
  selectedDevis: Devis | null;
  filters: DevisFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchDevis: () => Promise<void>;
  fetchDevisById: (id: string) => Promise<Devis | null>;
  fetchDevisByChantier: (chantierId: string) => Promise<Devis[]>;
  createDevis: (data: CreateDevisDto) => Promise<Devis>;
  updateDevis: (id: string, data: UpdateDevisDto) => Promise<Devis>;
  deleteDevis: (id: string) => Promise<void>;
  sendDevis: (id: string, email?: string) => Promise<void>;
  acceptDevis: (id: string, signature?: string) => Promise<Devis>;
  refuseDevis: (id: string, reason?: string) => Promise<Devis>;
  downloadPdf: (id: string) => Promise<Blob>;
  setFilters: (filters: DevisFilters) => void;
  setPage: (page: number) => void;
  selectDevis: (devis: Devis | null) => void;
  clearError: () => void;
}

export const useDevisStore = create<DevisState>()(
  persist(
    (set, get) => ({
      devisList: [],
      selectedDevis: null,
      filters: {},
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },

      fetchDevis: async () => {
        set({ isLoading: true, error: null });
        try {
          const { pagination, filters } = get();
          const response = await devisApi.getAll({
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
          });
          set({
            devisList: response.data,
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

      fetchDevisById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const devis = await devisApi.getById(id);
          set({ selectedDevis: devis, isLoading: false });
          return devis;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Devis introuvable',
            isLoading: false,
          });
          return null;
        }
      },

      fetchDevisByChantier: async (chantierId: string) => {
        set({ isLoading: true, error: null });
        try {
          const devisList = await devisApi.getByChantier(chantierId);
          set({ isLoading: false });
          return devisList;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de chargement',
            isLoading: false,
          });
          return [];
        }
      },

      createDevis: async (data: CreateDevisDto) => {
        set({ isLoading: true, error: null });
        try {
          const devis = await devisApi.create(data);
          set((state) => ({
            devisList: [devis, ...state.devisList],
            isLoading: false,
          }));
          return devis;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de création',
            isLoading: false,
          });
          throw error;
        }
      },

      updateDevis: async (id: string, data: UpdateDevisDto) => {
        set({ isLoading: true, error: null });
        try {
          const devis = await devisApi.update(id, data);
          set((state) => ({
            devisList: state.devisList.map((d) => (d.id === id ? devis : d)),
            selectedDevis:
              state.selectedDevis?.id === id ? devis : state.selectedDevis,
            isLoading: false,
          }));
          return devis;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de mise à jour',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteDevis: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await devisApi.delete(id);
          set((state) => ({
            devisList: state.devisList.filter((d) => d.id !== id),
            selectedDevis:
              state.selectedDevis?.id === id ? null : state.selectedDevis,
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

      sendDevis: async (id: string, email?: string) => {
        set({ isLoading: true, error: null });
        try {
          await devisApi.send(id, email);
          const devis = await devisApi.getById(id);
          set((state) => ({
            devisList: state.devisList.map((d) => (d.id === id ? devis : d)),
            selectedDevis:
              state.selectedDevis?.id === id ? devis : state.selectedDevis,
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

      acceptDevis: async (id: string, signature?: string) => {
        set({ isLoading: true, error: null });
        try {
          const devis = await devisApi.accept(id, signature);
          set((state) => ({
            devisList: state.devisList.map((d) => (d.id === id ? devis : d)),
            selectedDevis:
              state.selectedDevis?.id === id ? devis : state.selectedDevis,
            isLoading: false,
          }));
          return devis;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur d'acceptation",
            isLoading: false,
          });
          throw error;
        }
      },

      refuseDevis: async (id: string, reason?: string) => {
        set({ isLoading: true, error: null });
        try {
          const devis = await devisApi.refuse(id, reason);
          set((state) => ({
            devisList: state.devisList.map((d) => (d.id === id ? devis : d)),
            selectedDevis:
              state.selectedDevis?.id === id ? devis : state.selectedDevis,
            isLoading: false,
          }));
          return devis;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de refus',
            isLoading: false,
          });
          throw error;
        }
      },

      downloadPdf: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const blob = await devisApi.getPdf(id);
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

      setFilters: (filters: DevisFilters) => {
        set((state) => ({
          filters,
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchDevis();
      },

      setPage: (page: number) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchDevis();
      },

      selectDevis: (devis: Devis | null) => {
        set({ selectedDevis: devis });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'devis-storage',
      partialize: (state) => ({
        devisList: state.devisList,
        filters: state.filters,
      }),
    }
  )
);
