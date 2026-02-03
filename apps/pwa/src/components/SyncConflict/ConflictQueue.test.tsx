import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConflictQueue } from './ConflictQueue';
import { useConflictStore } from '../../stores/conflicts';
import type { SyncConflict } from '../../types/sync.types';

// Les mocks doivent etre definis en inline dans vi.mock pour eviter le hoisting
vi.mock('../../db/sync', () => ({
  syncService: {
    syncAll: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock('../../db/schema', () => {
  const mockUpdate = vi.fn().mockResolvedValue(1);
  return {
    db: {
      clients: { update: mockUpdate },
      chantiers: { update: mockUpdate },
      interventions: { update: mockUpdate },
      devis: { update: mockUpdate },
      syncQueue: {
        where: vi.fn().mockReturnValue({
          equals: vi.fn().mockReturnValue({
            filter: vi.fn().mockReturnValue({
              toArray: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
        update: vi.fn().mockResolvedValue(1),
      },
    },
  };
});

const createMockConflict = (id: string): SyncConflict => ({
  id,
  entityType: 'intervention',
  entityId: `int-${id}`,
  entityLabel: `Intervention #${id}`,
  localVersion: {
    notes: 'Version locale',
    statut: 'en_cours',
    version: 1,
  },
  serverVersion: {
    notes: 'Version serveur',
    statut: 'terminee',
    version: 2,
  },
  localTimestamp: new Date('2026-02-03T10:00:00'),
  serverTimestamp: new Date('2026-02-03T12:00:00'),
  conflictingFields: ['notes', 'statut'],
});

describe('ConflictQueue', () => {
  beforeEach(() => {
    useConflictStore.setState({
      conflicts: [],
      currentIndex: 0,
      sessionPreference: null,
      resolutionHistory: [],
    });
    vi.clearAllMocks();
  });

  it('renders nothing when no conflicts', () => {
    const { container } = render(<ConflictQueue />);
    expect(container.firstChild).toBeNull();
  });

  it('renders ConflictModal when there is a conflict', () => {
    const conflict = createMockConflict('1');
    useConflictStore.getState().addConflict(conflict);

    render(<ConflictQueue />);

    expect(screen.getByText(/Conflit sur Intervention #1/)).toBeInTheDocument();
  });

  it('displays first conflict when multiple exist', () => {
    const conflict1 = createMockConflict('1');
    const conflict2 = createMockConflict('2');

    useConflictStore.getState().addConflict(conflict1);
    useConflictStore.getState().addConflict(conflict2);

    render(<ConflictQueue />);

    expect(screen.getByText(/Conflit sur Intervention #1/)).toBeInTheDocument();
    expect(screen.queryByText(/Conflit sur Intervention #2/)).not.toBeInTheDocument();
  });

  it('resolves conflict with keep_local', async () => {
    const conflict = createMockConflict('1');
    useConflictStore.getState().addConflict(conflict);

    render(<ConflictQueue />);
    fireEvent.click(screen.getByText('Garder la mienne'));

    await waitFor(() => {
      expect(useConflictStore.getState().conflicts.length).toBe(0);
    });
  });

  it('resolves conflict with keep_server', async () => {
    const conflict = createMockConflict('1');
    useConflictStore.getState().addConflict(conflict);

    render(<ConflictQueue />);
    fireEvent.click(screen.getByText('Garder serveur'));

    await waitFor(() => {
      expect(useConflictStore.getState().conflicts.length).toBe(0);
    });
  });

  it('shows next conflict after resolving first one', async () => {
    const conflict1 = createMockConflict('1');
    const conflict2 = createMockConflict('2');

    useConflictStore.getState().addConflict(conflict1);
    useConflictStore.getState().addConflict(conflict2);

    const { rerender } = render(<ConflictQueue />);

    expect(screen.getByText(/Conflit sur Intervention #1/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Garder la mienne'));

    await waitFor(() => {
      expect(useConflictStore.getState().conflicts.length).toBe(1);
    });

    rerender(<ConflictQueue />);

    expect(screen.getByText(/Conflit sur Intervention #2/)).toBeInTheDocument();
  });

  it('handles merge resolution correctly', async () => {
    const conflict = createMockConflict('1');
    useConflictStore.getState().addConflict(conflict);

    render(<ConflictQueue />);

    fireEvent.click(screen.getByText('Fusionner'));
    fireEvent.click(screen.getByText('Confirmer la fusion'));

    await waitFor(() => {
      expect(useConflictStore.getState().conflicts.length).toBe(0);
    });
  });

  it('stores resolution in history', async () => {
    const conflict = createMockConflict('1');
    useConflictStore.getState().addConflict(conflict);

    render(<ConflictQueue />);
    fireEvent.click(screen.getByText('Garder la mienne'));

    await waitFor(() => {
      const history = useConflictStore.getState().resolutionHistory;
      expect(history.length).toBeGreaterThan(0);
      expect(history[history.length - 1].resolution).toBe('keep_local');
      expect(history[history.length - 1].conflictId).toBe('1');
    });
  });

  it('shows progress indicator when multiple conflicts', () => {
    useConflictStore.getState().addConflict(createMockConflict('1'));
    useConflictStore.getState().addConflict(createMockConflict('2'));
    useConflictStore.getState().addConflict(createMockConflict('3'));

    render(<ConflictQueue />);

    expect(screen.getByText('Conflit 1 / 3')).toBeInTheDocument();
  });

  it('does not show progress indicator for single conflict', () => {
    useConflictStore.getState().addConflict(createMockConflict('1'));

    render(<ConflictQueue />);

    expect(screen.queryByText(/Conflit 1 \/ 1/)).not.toBeInTheDocument();
  });

  it('shows navigation buttons when multiple conflicts', () => {
    useConflictStore.getState().addConflict(createMockConflict('1'));
    useConflictStore.getState().addConflict(createMockConflict('2'));

    render(<ConflictQueue />);

    expect(screen.getByText('Precedent')).toBeInTheDocument();
    expect(screen.getByText('Suivant')).toBeInTheDocument();
  });

  it('navigates between conflicts with next/prev buttons', () => {
    useConflictStore.getState().addConflict(createMockConflict('1'));
    useConflictStore.getState().addConflict(createMockConflict('2'));

    render(<ConflictQueue />);

    expect(screen.getByText(/Conflit sur Intervention #1/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Suivant'));

    expect(screen.getByText(/Conflit sur Intervention #2/)).toBeInTheDocument();
    expect(screen.getByText('Conflit 2 / 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Precedent'));

    expect(screen.getByText(/Conflit sur Intervention #1/)).toBeInTheDocument();
  });

  it('shows apply-to-all checkbox for multiple conflicts', () => {
    useConflictStore.getState().addConflict(createMockConflict('1'));
    useConflictStore.getState().addConflict(createMockConflict('2'));
    useConflictStore.getState().addConflict(createMockConflict('3'));

    render(<ConflictQueue />);

    expect(screen.getByText(/Appliquer ce choix aux 2 conflits restants/)).toBeInTheDocument();
  });

  it('resolves all remaining conflicts when apply-to-all is checked', async () => {
    useConflictStore.getState().addConflict(createMockConflict('1'));
    useConflictStore.getState().addConflict(createMockConflict('2'));
    useConflictStore.getState().addConflict(createMockConflict('3'));

    render(<ConflictQueue />);

    // Cocher "Appliquer a tous"
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Resoudre
    fireEvent.click(screen.getByText('Garder la mienne'));

    await waitFor(() => {
      expect(useConflictStore.getState().conflicts).toHaveLength(0);
      expect(useConflictStore.getState().resolutionHistory).toHaveLength(3);
    });
  });

  it('shows session preference buttons for multiple conflicts', () => {
    useConflictStore.getState().addConflict(createMockConflict('1'));
    useConflictStore.getState().addConflict(createMockConflict('2'));

    render(<ConflictQueue />);

    expect(screen.getByText('Toujours garder ma version')).toBeInTheDocument();
    expect(screen.getByText('Toujours garder serveur')).toBeInTheDocument();
  });
});

describe('ConflictQueue E2E Flow', () => {
  beforeEach(() => {
    useConflictStore.setState({
      conflicts: [],
      currentIndex: 0,
      sessionPreference: null,
      resolutionHistory: [],
    });
    vi.clearAllMocks();
  });

  it('complete flow: detect conflict -> show modal -> resolve', async () => {
    const conflict: SyncConflict = {
      id: 'conflict-int-001',
      entityType: 'intervention',
      entityId: 'int-001',
      entityLabel: 'Intervention du 03/02/2026',
      localVersion: {
        id: 'int-001',
        notes: 'Travail effectue en local',
        statut: 'en_cours',
        dureeMinutes: 120,
        version: 1,
      },
      serverVersion: {
        id: 'int-001',
        notes: 'Travail mis a jour par collegue',
        statut: 'terminee',
        dureeMinutes: 180,
        version: 2,
      },
      localTimestamp: new Date('2026-02-03T09:00:00'),
      serverTimestamp: new Date('2026-02-03T11:00:00'),
      conflictingFields: ['notes', 'statut', 'dureeMinutes'],
    };

    // 1. Conflit detecte et ajoute au store
    useConflictStore.getState().addConflict(conflict);

    // 2. Verifier que le store a le conflit
    expect(useConflictStore.getState().hasConflicts()).toBe(true);
    expect(useConflictStore.getState().getConflictCount()).toBe(1);

    // 3. Render ConflictQueue - la modal devrait s'afficher
    render(<ConflictQueue />);

    expect(screen.getByText(/Conflit sur Intervention/)).toBeInTheDocument();
    expect(screen.getByText('Travail effectue en local')).toBeInTheDocument();
    expect(screen.getByText('Travail mis a jour par collegue')).toBeInTheDocument();

    // 4. Utilisateur choisit de garder sa version locale
    fireEvent.click(screen.getByText('Garder la mienne'));

    // 5. Verifier que le conflit est retire du store
    await waitFor(() => {
      expect(useConflictStore.getState().hasConflicts()).toBe(false);
    });

    // 6. Verifier que la resolution est enregistree dans l'historique
    const history = useConflictStore.getState().resolutionHistory;
    expect(history.length).toBeGreaterThan(0);
    expect(history[history.length - 1].resolution).toBe('keep_local');
  });

  it('handles multiple conflicts in sequence', async () => {
    const conflicts = [
      createMockConflict('1'),
      createMockConflict('2'),
      createMockConflict('3'),
    ];

    conflicts.forEach(c => useConflictStore.getState().addConflict(c));

    expect(useConflictStore.getState().getConflictCount()).toBe(3);

    const { rerender } = render(<ConflictQueue />);

    // Premier conflit
    expect(screen.getByText(/Conflit sur Intervention #1/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Garder la mienne'));

    await waitFor(() => {
      expect(useConflictStore.getState().getConflictCount()).toBe(2);
    });

    rerender(<ConflictQueue />);

    // Deuxieme conflit
    expect(screen.getByText(/Conflit sur Intervention #2/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Garder serveur'));

    await waitFor(() => {
      expect(useConflictStore.getState().getConflictCount()).toBe(1);
    });

    rerender(<ConflictQueue />);

    // Troisieme conflit
    expect(screen.getByText(/Conflit sur Intervention #3/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Fusionner'));
    fireEvent.click(screen.getByText('Confirmer la fusion'));

    // Tous les conflits resolus
    await waitFor(() => {
      expect(useConflictStore.getState().hasConflicts()).toBe(false);
    });

    // Historique contient les 3 resolutions
    const history = useConflictStore.getState().resolutionHistory;
    expect(history.length).toBeGreaterThanOrEqual(3);
    const lastThree = history.slice(-3);
    expect(lastThree.map(h => h.resolution)).toEqual(['keep_local', 'keep_server', 'merge']);
  });

  it('handles different entity types', async () => {
    const entityTypes: Array<'client' | 'chantier' | 'intervention' | 'devis'> = [
      'client',
      'chantier',
      'intervention',
      'devis',
    ];

    for (const entityType of entityTypes) {
      // Reset store state
      useConflictStore.getState().clearAllConflicts();

      const conflict: SyncConflict = {
        ...createMockConflict(entityType),
        entityType,
        entityId: `${entityType}-123`,
      };

      useConflictStore.getState().addConflict(conflict);

      const { unmount } = render(<ConflictQueue />);

      // Verifier que la modal s'affiche
      expect(screen.getByText(/Conflit sur/)).toBeInTheDocument();

      fireEvent.click(screen.getByText('Garder la mienne'));

      // Verifier resolution
      await waitFor(() => {
        expect(useConflictStore.getState().conflicts.length).toBe(0);
      });

      unmount();
    }
  });
});
