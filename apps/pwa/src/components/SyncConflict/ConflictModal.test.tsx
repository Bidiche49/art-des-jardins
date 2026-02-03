import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConflictModal } from './ConflictModal';
import type { SyncConflict } from '../../types/sync.types';

const mockConflict: SyncConflict = {
  id: 'conflict-1',
  entityType: 'intervention',
  entityId: 'int-123',
  entityLabel: 'Intervention #123',
  localVersion: {
    notes: 'Taille haie OK',
    statut: 'en_cours',
    description: 'Entretien jardin',
  },
  serverVersion: {
    notes: 'Taille + tonte demandee',
    statut: 'en_cours',
    description: 'Entretien jardin complet',
  },
  localTimestamp: new Date('2026-02-03T10:00:00'),
  serverTimestamp: new Date('2026-02-03T12:00:00'),
  conflictingFields: ['notes', 'description'],
};

describe('ConflictModal', () => {
  const mockOnResolve = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders conflict information', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Conflit sur Intervention #123/)).toBeInTheDocument();
    expect(screen.getByText('Taille haie OK')).toBeInTheDocument();
    expect(screen.getByText('Taille + tonte demandee')).toBeInTheDocument();
  });

  it('renders version headers', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Votre version')).toBeInTheDocument();
    expect(screen.getByText('Version serveur')).toBeInTheDocument();
  });

  it('renders all three action buttons', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Garder la mienne')).toBeInTheDocument();
    expect(screen.getByText('Garder serveur')).toBeInTheDocument();
    expect(screen.getByText('Fusionner')).toBeInTheDocument();
  });

  it('calls onResolve with keep_local when clicking "Garder la mienne"', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Garder la mienne'));
    expect(mockOnResolve).toHaveBeenCalledWith('keep_local');
  });

  it('calls onResolve with keep_server when clicking "Garder serveur"', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Garder serveur'));
    expect(mockOnResolve).toHaveBeenCalledWith('keep_server');
  });

  it('enters merge mode when clicking "Fusionner"', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Fusionner'));

    expect(screen.getByText('Version fusionnee')).toBeInTheDocument();
    expect(screen.getByText('Confirmer la fusion')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeInTheDocument();
  });

  it('calls onResolve with merge and merged data when confirming merge', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Fusionner'));
    fireEvent.click(screen.getByText('Confirmer la fusion'));

    expect(mockOnResolve).toHaveBeenCalledWith('merge', expect.objectContaining({
      notes: 'Taille haie OK',
      statut: 'en_cours',
    }));
  });

  it('exits merge mode when clicking cancel', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Fusionner'));
    expect(screen.getByText('Version fusionnee')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Annuler'));
    expect(screen.getByText('Votre version')).toBeInTheDocument();
    expect(screen.queryByText('Version fusionnee')).not.toBeInTheDocument();
  });

  it('highlights conflicting fields', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    // The conflicting field rows should have amber background
    const conflictingRows = document.querySelectorAll('.bg-amber-50');
    expect(conflictingRows.length).toBeGreaterThan(0);
  });

  it('displays field labels correctly', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getAllByText('Notes').length).toBe(2);
    expect(screen.getAllByText('Statut').length).toBe(2);
    expect(screen.getAllByText('Description').length).toBe(2);
  });

  it('shows merge mode inputs when in merge mode', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Fusionner'));

    const inputs = document.querySelectorAll('input[type="text"], textarea');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('updates merged data when editing in merge mode', () => {
    render(
      <ConflictModal
        conflict={mockConflict}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Fusionner'));

    const inputs = document.querySelectorAll('input[type="text"], textarea');
    const notesInput = inputs[0] as HTMLInputElement;

    fireEvent.change(notesInput, { target: { value: 'Valeur fusionnee' } });
    fireEvent.click(screen.getByText('Confirmer la fusion'));

    expect(mockOnResolve).toHaveBeenCalledWith('merge', expect.objectContaining({
      notes: 'Valeur fusionnee',
    }));
  });
});
