import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Absences } from './Absences';
import { absencesApi } from '@/api';
import { useAuthStore } from '@/stores/auth';
import toast from 'react-hot-toast';

// Mock the API
vi.mock('@/api', () => ({
  absencesApi: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    getPending: vi.fn(),
    create: vi.fn(),
    valider: vi.fn(),
    refuser: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}));

const mockAbsences = {
  data: [
    {
      id: 'abs-1',
      userId: 'user-1',
      dateDebut: '2026-02-01T00:00:00',
      dateFin: '2026-02-07T23:59:59',
      type: 'conge' as const,
      motif: 'Vacances',
      validee: false,
      user: { id: 'user-1', nom: 'Dupont', prenom: 'Jean' },
    },
    {
      id: 'abs-2',
      userId: 'user-1',
      dateDebut: '2026-03-15T00:00:00',
      dateFin: '2026-03-16T23:59:59',
      type: 'maladie' as const,
      motif: null,
      validee: true,
      user: { id: 'user-1', nom: 'Dupont', prenom: 'Jean' },
    },
  ],
  meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
};

const renderAbsences = () => {
  return render(
    <BrowserRouter>
      <Absences />
    </BrowserRouter>
  );
};

describe('Absences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('as employee', () => {
    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: { id: 'user-1', role: 'employe' },
      });
      (absencesApi.getMine as any).mockResolvedValue(mockAbsences);
    });

    it('should render page title', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('Absences')).toBeInTheDocument();
      });
    });

    it('should load and display absences', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(absencesApi.getMine).toHaveBeenCalled();
        expect(screen.getByText('Conge')).toBeInTheDocument();
      });
    });

    it('should show validation status badges', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('En attente')).toBeInTheDocument();
        expect(screen.getByText('Validee')).toBeInTheDocument();
      });
    });

    it('should show declare button', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('+ Declarer')).toBeInTheDocument();
      });
    });

    it('should not show "A valider" tab', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(screen.queryByText('A valider')).not.toBeInTheDocument();
      });
    });

    it('should open form modal when clicking declare button', async () => {
      const user = userEvent.setup();
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('+ Declarer')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Declarer'));

      expect(screen.getByText('Declarer une absence')).toBeInTheDocument();
      expect(screen.getByText("Type d'absence *")).toBeInTheDocument();
    });
  });

  describe('as patron', () => {
    const mockPendingAbsences = {
      data: [mockAbsences.data[0]],
      meta: { total: 1, page: 1, limit: 100, totalPages: 1 },
    };

    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: { id: 'patron-1', role: 'patron' },
      });
      (absencesApi.getAll as any).mockResolvedValue(mockAbsences);
      (absencesApi.getPending as any).mockResolvedValue(mockPendingAbsences);
    });

    it('should show "A valider" tab with count', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('A valider')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });

    it('should show "Toutes" tab', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('Toutes')).toBeInTheDocument();
      });
    });

    it('should show validate and refuse buttons for pending absences', async () => {
      const user = userEvent.setup();
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('A valider')).toBeInTheDocument();
      });

      await user.click(screen.getByText('A valider'));

      await waitFor(() => {
        expect(screen.getByText('Valider')).toBeInTheDocument();
        expect(screen.getByText('Refuser')).toBeInTheDocument();
      });
    });

    it('should validate absence when clicking validate', async () => {
      const user = userEvent.setup();
      (absencesApi.valider as any).mockResolvedValue({});
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('A valider')).toBeInTheDocument();
      });

      await user.click(screen.getByText('A valider'));

      await waitFor(() => {
        expect(screen.getByText('Valider')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Valider'));

      await waitFor(() => {
        expect(absencesApi.valider).toHaveBeenCalledWith('abs-1');
        expect(toast.success).toHaveBeenCalledWith('Absence validee');
      });
    });

    it('should refuse absence when clicking refuse', async () => {
      const user = userEvent.setup();
      (absencesApi.refuser as any).mockResolvedValue({});
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('A valider')).toBeInTheDocument();
      });

      await user.click(screen.getByText('A valider'));

      await waitFor(() => {
        expect(screen.getByText('Refuser')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Refuser'));

      await waitFor(() => {
        expect(absencesApi.refuser).toHaveBeenCalledWith('abs-1');
        expect(toast.success).toHaveBeenCalledWith('Absence refusee');
      });
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: { id: 'user-1', role: 'employe' },
      });
      (absencesApi.getMine as any).mockResolvedValue({ data: [], meta: {} });
      (absencesApi.create as any).mockResolvedValue({});
    });

    it('should create absence with form data', async () => {
      const user = userEvent.setup();
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('+ Declarer')).toBeInTheDocument();
      });

      await user.click(screen.getByText('+ Declarer'));

      // Fill form
      const motifInput = screen.getByPlaceholderText("Raison de l'absence...");
      await user.type(motifInput, 'Test motif');

      // Submit
      await user.click(screen.getByText('Envoyer la demande'));

      await waitFor(() => {
        expect(absencesApi.create).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Demande envoyee');
      });
    });
  });

  describe('empty state', () => {
    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: { id: 'user-1', role: 'employe' },
      });
      (absencesApi.getMine as any).mockResolvedValue({ data: [], meta: {} });
    });

    it('should show empty state when no absences', async () => {
      renderAbsences();

      await waitFor(() => {
        expect(screen.getByText('Aucune absence')).toBeInTheDocument();
        expect(screen.getByText('Declarer une absence')).toBeInTheDocument();
      });
    });
  });
});
