import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyncConflict, ConflictResolution, ConflictResolutionResult } from '../types/sync.types';

interface ConflictState {
  conflicts: SyncConflict[];
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
}

export const useConflictStore = create<ConflictState>()(
  persist(
    (set, get) => ({
      conflicts: [],
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
        set({ conflicts: [] });
      },

      hasConflicts: () => {
        return get().conflicts.length > 0;
      },

      getConflictCount: () => {
        return get().conflicts.length;
      },
    }),
    {
      name: 'conflict-storage',
      partialize: (state) => ({
        conflicts: state.conflicts,
        resolutionHistory: state.resolutionHistory.slice(-50), // Garde les 50 derniers
      }),
    }
  )
);
