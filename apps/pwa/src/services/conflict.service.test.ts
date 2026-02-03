import { describe, it, expect, vi } from 'vitest';
import {
  hasConflict,
  detectConflictingFields,
  generateEntityLabel,
  createSyncConflict,
  applyConflictResolution,
} from './conflict.service';
import type { SyncConflict } from '../types/sync.types';

// Mock du store
vi.mock('../stores/conflicts', () => ({
  useConflictStore: {
    getState: () => ({
      addConflict: vi.fn(),
    }),
  },
}));

describe('conflict.service', () => {
  describe('hasConflict', () => {
    it('retourne false si versions egales', () => {
      const local = { version: 1, updatedAt: '2026-01-01T10:00:00Z' };
      const server = { version: 1, updatedAt: '2026-01-01T10:00:00Z' };

      expect(hasConflict(local, server)).toBe(false);
    });

    it('retourne false si version locale superieure', () => {
      const local = { version: 2, updatedAt: '2026-01-01T10:00:00Z' };
      const server = { version: 1, updatedAt: '2026-01-01T09:00:00Z' };

      expect(hasConflict(local, server)).toBe(false);
    });

    it('retourne true si version serveur superieure avec timestamps differents', () => {
      const local = { version: 1, updatedAt: '2026-01-01T09:00:00Z' };
      const server = { version: 2, updatedAt: '2026-01-01T10:00:00Z' };

      expect(hasConflict(local, server)).toBe(true);
    });

    it('retourne false si version serveur superieure mais timestamps identiques', () => {
      const local = { version: 1, updatedAt: '2026-01-01T10:00:00Z' };
      const server = { version: 2, updatedAt: '2026-01-01T10:00:00Z' };

      expect(hasConflict(local, server)).toBe(false);
    });

    it('gere les entites sans version (default 0)', () => {
      const local = { updatedAt: '2026-01-01T09:00:00Z' };
      const server = { version: 1, updatedAt: '2026-01-01T10:00:00Z' };

      expect(hasConflict(local, server)).toBe(true);
    });

    it('gere les entites sans timestamp', () => {
      const local = { version: 1 };
      const server = { version: 2 };

      // Timestamps sont tous deux 0, donc pas de conflit
      expect(hasConflict(local, server)).toBe(false);
    });

    it('accepte Date objects pour updatedAt', () => {
      const local = { version: 1, updatedAt: new Date('2026-01-01T09:00:00Z') };
      const server = { version: 2, updatedAt: new Date('2026-01-01T10:00:00Z') };

      expect(hasConflict(local, server)).toBe(true);
    });
  });

  describe('detectConflictingFields', () => {
    it('detecte les champs avec valeurs differentes', () => {
      const local = { nom: 'Jean', email: 'jean@test.com', telephone: '0123456789' };
      const server = { nom: 'Jean', email: 'jean.new@test.com', telephone: '0123456789' };

      const conflicts = detectConflictingFields(local, server);

      expect(conflicts).toEqual(['email']);
    });

    it('detecte plusieurs champs en conflit', () => {
      const local = { nom: 'Jean', email: 'jean@test.com', adresse: '1 rue A' };
      const server = { nom: 'Pierre', email: 'pierre@test.com', adresse: '1 rue A' };

      const conflicts = detectConflictingFields(local, server);

      expect(conflicts).toContain('nom');
      expect(conflicts).toContain('email');
      expect(conflicts).not.toContain('adresse');
    });

    it('exclut les champs techniques', () => {
      const local = {
        id: '1',
        version: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-02',
        syncedAt: 12345,
        nom: 'Jean',
      };
      const server = {
        id: '1',
        version: 2,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-03',
        syncedAt: 67890,
        nom: 'Pierre',
      };

      const conflicts = detectConflictingFields(local, server);

      expect(conflicts).toEqual(['nom']);
      expect(conflicts).not.toContain('id');
      expect(conflicts).not.toContain('version');
      expect(conflicts).not.toContain('createdAt');
      expect(conflicts).not.toContain('updatedAt');
      expect(conflicts).not.toContain('syncedAt');
    });

    it('detecte les champs presents dans un seul objet', () => {
      const local = { nom: 'Jean', notes: 'note locale' };
      const server = { nom: 'Jean' };

      const conflicts = detectConflictingFields(local, server);

      expect(conflicts).toContain('notes');
    });

    it('compare correctement les objets imbriques', () => {
      const local = { data: { a: 1, b: 2 } };
      const server = { data: { a: 1, b: 3 } };

      const conflicts = detectConflictingFields(local, server);

      expect(conflicts).toContain('data');
    });

    it('retourne tableau vide si pas de differences', () => {
      const local = { nom: 'Jean', email: 'jean@test.com' };
      const server = { nom: 'Jean', email: 'jean@test.com' };

      const conflicts = detectConflictingFields(local, server);

      expect(conflicts).toEqual([]);
    });
  });

  describe('generateEntityLabel', () => {
    it('genere label pour client', () => {
      const entity = { id: '123', nom: 'Dupont Jean' };
      expect(generateEntityLabel('client', entity)).toBe('Dupont Jean');
    });

    it('genere label fallback pour client sans nom', () => {
      const entity = { id: '123' };
      expect(generateEntityLabel('client', entity)).toBe('Client #123');
    });

    it('genere label pour chantier', () => {
      const entity = { id: '456', nom: 'Jardin Residence' };
      expect(generateEntityLabel('chantier', entity)).toBe('Jardin Residence');
    });

    it('genere label pour intervention avec date', () => {
      const entity = { id: '789', date: '2026-01-15' };
      const label = generateEntityLabel('intervention', entity);
      expect(label).toContain('Intervention du');
    });

    it('genere label fallback pour intervention sans date', () => {
      const entity = { id: '789' };
      expect(generateEntityLabel('intervention', entity)).toBe('Intervention #789');
    });

    it('genere label pour devis', () => {
      const entity = { id: '101', numero: 'DEV-2026-001' };
      expect(generateEntityLabel('devis', entity)).toBe('DEV-2026-001');
    });
  });

  describe('createSyncConflict', () => {
    it('cree un objet SyncConflict complet', () => {
      const local = {
        id: '123',
        nom: 'Jean',
        email: 'jean@old.com',
        updatedAt: '2026-01-01T09:00:00Z',
      };
      const server = {
        id: '123',
        nom: 'Jean',
        email: 'jean@new.com',
        updatedAt: '2026-01-01T10:00:00Z',
      };

      const conflict = createSyncConflict('client', '123', local, server);

      expect(conflict.id).toMatch(/^conflict-client-123-\d+$/);
      expect(conflict.entityType).toBe('client');
      expect(conflict.entityId).toBe('123');
      expect(conflict.entityLabel).toBe('Jean');
      expect(conflict.localVersion).toEqual(local);
      expect(conflict.serverVersion).toEqual(server);
      expect(conflict.conflictingFields).toEqual(['email']);
      expect(conflict.localTimestamp).toBeInstanceOf(Date);
      expect(conflict.serverTimestamp).toBeInstanceOf(Date);
    });

    it('genere un ID unique pour differentes entites', () => {
      const local = { nom: 'Test' };
      const server = { nom: 'Test2' };

      const conflict1 = createSyncConflict('client', '1', local, server);
      const conflict2 = createSyncConflict('client', '2', local, server);
      const conflict3 = createSyncConflict('chantier', '1', local, server);

      expect(conflict1.id).not.toBe(conflict2.id);
      expect(conflict1.id).not.toBe(conflict3.id);
      expect(conflict2.id).not.toBe(conflict3.id);
    });
  });

  describe('applyConflictResolution', () => {
    const mockConflict: SyncConflict = {
      id: 'conflict-1',
      entityType: 'client',
      entityId: '123',
      entityLabel: 'Test Client',
      localVersion: { nom: 'Jean', email: 'jean@local.com', version: 1 },
      serverVersion: { nom: 'Pierre', email: 'pierre@server.com', version: 2 },
      localTimestamp: new Date(),
      serverTimestamp: new Date(),
      conflictingFields: ['nom', 'email'],
    };

    it('keep_local retourne version locale avec version incrementee', () => {
      const result = applyConflictResolution(mockConflict, 'keep_local');

      expect(result.nom).toBe('Jean');
      expect(result.email).toBe('jean@local.com');
      expect(result.version).toBe(3); // serverVersion + 1
    });

    it('keep_server retourne version serveur', () => {
      const result = applyConflictResolution(mockConflict, 'keep_server');

      expect(result).toEqual(mockConflict.serverVersion);
    });

    it('merge retourne donnees fusionnees avec version incrementee', () => {
      const mergedData = { nom: 'Jean', email: 'pierre@server.com' };
      const result = applyConflictResolution(mockConflict, 'merge', mergedData);

      expect(result.nom).toBe('Jean');
      expect(result.email).toBe('pierre@server.com');
      expect(result.version).toBe(3);
    });

    it('merge sans mergedData lance une erreur', () => {
      expect(() => applyConflictResolution(mockConflict, 'merge')).toThrow(
        'mergedData is required for merge resolution'
      );
    });
  });
});
