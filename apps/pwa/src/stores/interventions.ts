import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  interventionsApi,
  type Intervention,
  type CreateInterventionDto,
  type UpdateInterventionDto,
  type InterventionFilters,
} from '@/api';

interface InterventionsState {
  interventions: Intervention[];
  selectedIntervention: Intervention | null;
  filters: InterventionFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchInterventions: () => Promise<void>;
  fetchInterventionById: (id: string) => Promise<Intervention | null>;
  fetchInterventionsByChantier: (chantierId: string) => Promise<Intervention[]>;
  fetchInterventionsByDateRange: (from: Date, to: Date) => Promise<Intervention[]>;
  createIntervention: (data: CreateInterventionDto) => Promise<Intervention>;
  updateIntervention: (id: string, data: UpdateInterventionDto) => Promise<Intervention>;
  deleteIntervention: (id: string) => Promise<void>;
  startIntervention: (id: string) => Promise<Intervention>;
  completeIntervention: (id: string, heureFin?: string) => Promise<Intervention>;
  addPhoto: (id: string, photoUrl: string) => Promise<void>;
  setFilters: (filters: InterventionFilters) => void;
  setPage: (page: number) => void;
  selectIntervention: (intervention: Intervention | null) => void;
  clearError: () => void;
}

export const useInterventionsStore = create<InterventionsState>()(
  persist(
    (set, get) => ({
      interventions: [],
      selectedIntervention: null,
      filters: {},
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },

      fetchInterventions: async () => {
        set({ isLoading: true, error: null });
        try {
          const { pagination, filters } = get();
          const response = await interventionsApi.getAll({
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
          });
          set({
            interventions: response.data,
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

      fetchInterventionById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const intervention = await interventionsApi.getById(id);
          set({ selectedIntervention: intervention, isLoading: false });
          return intervention;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Intervention introuvable',
            isLoading: false,
          });
          return null;
        }
      },

      fetchInterventionsByChantier: async (chantierId: string) => {
        set({ isLoading: true, error: null });
        try {
          const interventions = await interventionsApi.getByChantier(chantierId);
          set({ isLoading: false });
          return interventions;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de chargement',
            isLoading: false,
          });
          return [];
        }
      },

      fetchInterventionsByDateRange: async (from: Date, to: Date) => {
        set({ isLoading: true, error: null });
        try {
          const interventions = await interventionsApi.getByDateRange(from, to);
          set({ interventions, isLoading: false });
          return interventions;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de chargement',
            isLoading: false,
          });
          return [];
        }
      },

      createIntervention: async (data: CreateInterventionDto) => {
        set({ isLoading: true, error: null });
        try {
          const intervention = await interventionsApi.create(data);
          set((state) => ({
            interventions: [intervention, ...state.interventions],
            isLoading: false,
          }));
          return intervention;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de création',
            isLoading: false,
          });
          throw error;
        }
      },

      updateIntervention: async (id: string, data: UpdateInterventionDto) => {
        set({ isLoading: true, error: null });
        try {
          const intervention = await interventionsApi.update(id, data);
          set((state) => ({
            interventions: state.interventions.map((i) =>
              i.id === id ? intervention : i
            ),
            selectedIntervention:
              state.selectedIntervention?.id === id
                ? intervention
                : state.selectedIntervention,
            isLoading: false,
          }));
          return intervention;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de mise à jour',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteIntervention: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await interventionsApi.delete(id);
          set((state) => ({
            interventions: state.interventions.filter((i) => i.id !== id),
            selectedIntervention:
              state.selectedIntervention?.id === id
                ? null
                : state.selectedIntervention,
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

      startIntervention: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const intervention = await interventionsApi.start(id);
          set((state) => ({
            interventions: state.interventions.map((i) =>
              i.id === id ? intervention : i
            ),
            selectedIntervention:
              state.selectedIntervention?.id === id
                ? intervention
                : state.selectedIntervention,
            isLoading: false,
          }));
          return intervention;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de démarrage',
            isLoading: false,
          });
          throw error;
        }
      },

      completeIntervention: async (id: string, heureFin?: string) => {
        set({ isLoading: true, error: null });
        try {
          const intervention = await interventionsApi.complete(id, heureFin);
          set((state) => ({
            interventions: state.interventions.map((i) =>
              i.id === id ? intervention : i
            ),
            selectedIntervention:
              state.selectedIntervention?.id === id
                ? intervention
                : state.selectedIntervention,
            isLoading: false,
          }));
          return intervention;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erreur de complétion',
            isLoading: false,
          });
          throw error;
        }
      },

      addPhoto: async (id: string, photoUrl: string) => {
        try {
          const intervention = await interventionsApi.addPhoto(id, photoUrl);
          set((state) => ({
            interventions: state.interventions.map((i) =>
              i.id === id ? intervention : i
            ),
            selectedIntervention:
              state.selectedIntervention?.id === id
                ? intervention
                : state.selectedIntervention,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur d'upload",
          });
          throw error;
        }
      },

      setFilters: (filters: InterventionFilters) => {
        set((state) => ({
          filters,
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchInterventions();
      },

      setPage: (page: number) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchInterventions();
      },

      selectIntervention: (intervention: Intervention | null) => {
        set({ selectedIntervention: intervention });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'interventions-storage',
      partialize: (state) => ({
        interventions: state.interventions,
        filters: state.filters,
      }),
    }
  )
);
