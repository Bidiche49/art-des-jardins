import { describe, it, expect, beforeEach } from 'vitest';
import { useConflictStore } from './conflicts';
import type { SyncConflict } from '../types/sync.types';

describe('useConflictStore', () => {
  beforeEach(() => {
    // Reset store state avant chaque test
    useConflictStore.setState({
      conflicts: [],
      resolutionHistory: [],
    });
  });

  const createMockConflict = (id: string, entityType: 'client' | 'chantier' = 'client'): SyncConflict => ({
    id,
    entityType,
    entityId: `entity-${id}`,
    entityLabel: `Label ${id}`,
    localVersion: { nom: 'Local' },
    serverVersion: { nom: 'Server' },
    localTimestamp: new Date(),
    serverTimestamp: new Date(),
    conflictingFields: ['nom'],
  });

  describe('addConflict', () => {
    it('ajoute un conflit au store', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);

      expect(useConflictStore.getState().conflicts).toHaveLength(1);
      expect(useConflictStore.getState().conflicts[0]).toEqual(conflict);
    });

    it('evite les doublons', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);
      useConflictStore.getState().addConflict(conflict);

      expect(useConflictStore.getState().conflicts).toHaveLength(1);
    });

    it('ajoute plusieurs conflits differents', () => {
      const conflict1 = createMockConflict('1');
      const conflict2 = createMockConflict('2');

      useConflictStore.getState().addConflict(conflict1);
      useConflictStore.getState().addConflict(conflict2);

      expect(useConflictStore.getState().conflicts).toHaveLength(2);
    });
  });

  describe('removeConflict', () => {
    it('supprime un conflit par ID', () => {
      const conflict1 = createMockConflict('1');
      const conflict2 = createMockConflict('2');

      useConflictStore.getState().addConflict(conflict1);
      useConflictStore.getState().addConflict(conflict2);
      useConflictStore.getState().removeConflict('1');

      expect(useConflictStore.getState().conflicts).toHaveLength(1);
      expect(useConflictStore.getState().conflicts[0].id).toBe('2');
    });

    it('ne fait rien si ID inexistant', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);
      useConflictStore.getState().removeConflict('inexistant');

      expect(useConflictStore.getState().conflicts).toHaveLength(1);
    });
  });

  describe('resolveConflict', () => {
    it('resout et supprime le conflit', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);

      const result = useConflictStore.getState().resolveConflict('1', 'keep_local');

      expect(useConflictStore.getState().conflicts).toHaveLength(0);
      expect(result).not.toBeNull();
      expect(result?.resolution).toBe('keep_local');
    });

    it('ajoute a lhistorique de resolution', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);

      useConflictStore.getState().resolveConflict('1', 'keep_server');

      const history = useConflictStore.getState().resolutionHistory;
      expect(history).toHaveLength(1);
      expect(history[0].conflictId).toBe('1');
      expect(history[0].resolution).toBe('keep_server');
    });

    it('inclut mergedData pour resolution merge', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);

      const mergedData = { nom: 'Merged Value' };
      const result = useConflictStore.getState().resolveConflict('1', 'merge', mergedData);

      expect(result?.mergedData).toEqual(mergedData);
    });

    it('retourne null si conflit inexistant', () => {
      const result = useConflictStore.getState().resolveConflict('inexistant', 'keep_local');
      expect(result).toBeNull();
    });
  });

  describe('getConflictById', () => {
    it('retourne le conflit par ID', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);

      const found = useConflictStore.getState().getConflictById('1');
      expect(found).toEqual(conflict);
    });

    it('retourne undefined si non trouve', () => {
      const found = useConflictStore.getState().getConflictById('inexistant');
      expect(found).toBeUndefined();
    });
  });

  describe('getConflictsByEntity', () => {
    it('filtre par entityType et entityId', () => {
      const conflict1 = createMockConflict('1', 'client');
      const conflict2 = createMockConflict('2', 'chantier');
      conflict1.entityId = 'entity-A';
      conflict2.entityId = 'entity-A';

      useConflictStore.getState().addConflict(conflict1);
      useConflictStore.getState().addConflict(conflict2);

      const clientConflicts = useConflictStore.getState().getConflictsByEntity('client', 'entity-A');
      expect(clientConflicts).toHaveLength(1);
      expect(clientConflicts[0].entityType).toBe('client');
    });

    it('retourne tableau vide si aucune correspondance', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);

      const result = useConflictStore.getState().getConflictsByEntity('devis', 'entity-X');
      expect(result).toEqual([]);
    });
  });

  describe('clearAllConflicts', () => {
    it('vide tous les conflits', () => {
      useConflictStore.getState().addConflict(createMockConflict('1'));
      useConflictStore.getState().addConflict(createMockConflict('2'));

      useConflictStore.getState().clearAllConflicts();

      expect(useConflictStore.getState().conflicts).toHaveLength(0);
    });

    it('preserve lhistorique de resolution', () => {
      const conflict = createMockConflict('1');
      useConflictStore.getState().addConflict(conflict);
      useConflictStore.getState().resolveConflict('1', 'keep_local');

      useConflictStore.getState().addConflict(createMockConflict('2'));
      useConflictStore.getState().clearAllConflicts();

      expect(useConflictStore.getState().resolutionHistory).toHaveLength(1);
    });
  });

  describe('hasConflicts', () => {
    it('retourne false si aucun conflit', () => {
      expect(useConflictStore.getState().hasConflicts()).toBe(false);
    });

    it('retourne true si conflits presents', () => {
      useConflictStore.getState().addConflict(createMockConflict('1'));
      expect(useConflictStore.getState().hasConflicts()).toBe(true);
    });
  });

  describe('getConflictCount', () => {
    it('retourne 0 si aucun conflit', () => {
      expect(useConflictStore.getState().getConflictCount()).toBe(0);
    });

    it('retourne le nombre de conflits', () => {
      useConflictStore.getState().addConflict(createMockConflict('1'));
      useConflictStore.getState().addConflict(createMockConflict('2'));
      useConflictStore.getState().addConflict(createMockConflict('3'));

      expect(useConflictStore.getState().getConflictCount()).toBe(3);
    });
  });
});
