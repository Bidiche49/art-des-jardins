import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyncConflict, ConflictResolution, ConflictResolutionResult } from '../types/sync.types';

export type SessionPreference = 'always_local' | 'always_server' | null;

interface ConflictState {
  conflicts: SyncConflict[];
  currentIndex: number;
  sessionPreference: SessionPreference;
  resolutionHistory: ConflictResolutionResult[];

  addConflict: (conflict: SyncConflict) => void;
  removeConflict: (conflictId: string) => void;
  resolveConflict: (
    conflictId: string,
    resolution: ConflictResolution,
    mergedData?: Record<string, unknown>
  ) => ConflictResolutionResult | null;
  getConflictById: (conflictId: string) => SyncConflict | undefined;
  getConflictsByEntity: (entityType: string, entityId: string) => SyncConflict[];
  clearAllConflicts: () => void;
  hasConflicts: () => boolean;
  getConflictCount: () => number;

  // Navigation entre conflits
  nextConflict: () => void;
  prevConflict: () => void;
  getCurrentConflict: () => SyncConflict | null;

  // Session preference (auto-resolve)
  setSessionPreference: (pref: SessionPreference) => void;
  clearSessionPreference: () => void;

  // Resoudre tous les conflits restants
  resolveAll: (resolution: ConflictResolution) => ConflictResolutionResult[];

  // Historique
  addToHistory: (result: ConflictResolutionResult) => void;
  clearHistory: () => void;
}

export const useConflictStore = create<ConflictState>()(
  persist(
    (set, get) => ({
      conflicts: [],
      currentIndex: 0,
      sessionPreference: null,
      resolutionHistory: [],

      addConflict: (conflict: SyncConflict) => {
        set((state) => {
          // Evite les doublons
          const exists = state.conflicts.some((c) => c.id === conflict.id);
          if (exists) return state;

          return {
            conflicts: [...state.conflicts, conflict],
          };
        });
      },

      removeConflict: (conflictId: string) => {
        set((state) => ({
          conflicts: state.conflicts.filter((c) => c.id !== conflictId),
        }));
      },

      resolveConflict: (
        conflictId: string,
        resolution: ConflictResolution,
        mergedData?: Record<string, unknown>
      ) => {
        const conflict = get().conflicts.find((c) => c.id === conflictId);
        if (!conflict) return null;

        const result: ConflictResolutionResult = {
          conflictId,
          resolution,
          mergedData,
          timestamp: new Date(),
        };

        set((state) => ({
          conflicts: state.conflicts.filter((c) => c.id !== conflictId),
          resolutionHistory: [...state.resolutionHistory, result],
        }));

        return result;
      },

      getConflictById: (conflictId: string) => {
        return get().conflicts.find((c) => c.id === conflictId);
      },

      getConflictsByEntity: (entityType: string, entityId: string) => {
        return get().conflicts.filter(
          (c) => c.entityType === entityType && c.entityId === entityId
        );
      },

      clearAllConflicts: () => {
        set({ conflicts: [], currentIndex: 0 });
      },

      hasConflicts: () => {
        return get().conflicts.length > 0;
      },

      getConflictCount: () => {
        return get().conflicts.length;
      },

      // Navigation entre conflits
      nextConflict: () => {
        set((state) => {
          const maxIndex = state.conflicts.length - 1;
          return {
            currentIndex: Math.min(state.currentIndex + 1, maxIndex),
          };
        });
      },

      prevConflict: () => {
        set((state) => ({
          currentIndex: Math.max(state.currentIndex - 1, 0),
        }));
      },

      getCurrentConflict: () => {
        const { conflicts, currentIndex } = get();
        return conflicts[currentIndex] ?? null;
      },

      // Session preference
      setSessionPreference: (pref: SessionPreference) => {
        set({ sessionPreference: pref });
      },

      clearSessionPreference: () => {
        set({ sessionPreference: null });
      },

      // Resoudre tous les conflits restants
      resolveAll: (resolution: ConflictResolution) => {
        const { conflicts, currentIndex } = get();
        const results: ConflictResolutionResult[] = [];

        // Resoudre tous les conflits a partir de l'index courant
        const remainingConflicts = conflicts.slice(currentIndex);

        for (const conflict of remainingConflicts) {
          const result: ConflictResolutionResult = {
            conflictId: conflict.id,
            resolution,
            timestamp: new Date(),
          };
          results.push(result);
        }

        set((state) => ({
          conflicts: conflicts.slice(0, currentIndex),
          currentIndex: 0,
          resolutionHistory: [...state.resolutionHistory, ...results],
        }));

        return results;
      },

      // Historique
      addToHistory: (result: ConflictResolutionResult) => {
        set((state) => ({
          resolutionHistory: [...state.resolutionHistory, result],
        }));
      },

      clearHistory: () => {
        set({ resolutionHistory: [] });
      },
    }),
    {
      name: 'conflict-storage',
      partialize: (state) => ({
        conflicts: state.conflicts,
        currentIndex: state.currentIndex,
        resolutionHistory: state.resolutionHistory.slice(-50), // Garde les 50 derniers
      }),
    }
  )
);
