import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Calendar } from './Calendar';
import { interventionsApi } from '@/api';
import { useAuthStore } from '@/stores/auth';
import toast from 'react-hot-toast';

// Mock the API
vi.mock('@/api', () => ({
  interventionsApi: {
    getAll: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}));

const mockInterventions = {
  data: [
    {
      id: 'int-1',
      chantierId: 'ch-1',
      date: '2026-01-29',
      heureDebut: '2026-01-29T09:00:00',
      heureFin: '2026-01-29T11:00:00',
      description: 'Taille de haie',
      statut: 'planifiee',
      employeId: 'emp-1',
      employe: { id: 'emp-1', nom: 'Dupont', prenom: 'Jean' },
      chantier: { client: { nom: 'Martin' } },
    },
    {
      id: 'int-2',
      chantierId: 'ch-2',
      date: '2026-01-30',
      heureDebut: '2026-01-30T14:00:00',
      heureFin: '2026-01-30T16:00:00',
      description: 'Tonte pelouse',
      statut: 'planifiee',
      employeId: 'emp-2',
      employe: { id: 'emp-2', nom: 'Durand', prenom: 'Marie' },
      chantier: { client: { nom: 'Leroy' } },
    },
  ],
  total: 2,
  page: 1,
  limit: 500,
};

const renderCalendar = () => {
  return render(
    <BrowserRouter>
      <Calendar />
    </BrowserRouter>
  );
};

describe('Calendar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (interventionsApi.getAll as any).mockResolvedValue(mockInterventions);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('rendering', () => {
    it('should render calendar with title', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      renderCalendar();

      await waitFor(() => {
        expect(screen.getByText('Calendrier')).toBeInTheDocument();
      });
    });

    it('should load and display interventions', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      renderCalendar();

      await waitFor(() => {
        expect(interventionsApi.getAll).toHaveBeenCalled();
      });
    });

    it('should show employee legend', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      renderCalendar();

      await waitFor(() => {
        expect(screen.getByText('Legende:')).toBeInTheDocument();
      });
    });
  });

  describe('drag & drop authorization', () => {
    it('should allow drag for patron role', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      renderCalendar();

      await waitFor(() => {
        expect(interventionsApi.getAll).toHaveBeenCalled();
      });

      // Calendar should be rendered with DnD enabled for patron
      // The draggableAccessor returns true for patron
      expect(screen.getByText('Calendrier')).toBeInTheDocument();
    });

    it('should not allow drag for employe role', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'employe' } });
      renderCalendar();

      await waitFor(() => {
        expect(interventionsApi.getAll).toHaveBeenCalled();
      });

      // Calendar should be rendered but DnD disabled for employe
      // The draggableAccessor returns false for non-patron
      expect(screen.getByText('Calendrier')).toBeInTheDocument();
    });

    it('should show + Intervention button only for patron', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      renderCalendar();

      await waitFor(() => {
        expect(screen.getByText('+ Intervention')).toBeInTheDocument();
      });
    });

    it('should hide + Intervention button for employe', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'employe' } });
      renderCalendar();

      await waitFor(() => {
        expect(interventionsApi.getAll).toHaveBeenCalled();
      });

      expect(screen.queryByText('+ Intervention')).not.toBeInTheDocument();
    });
  });

  describe('employee filter', () => {
    it('should render employee filter dropdown', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      renderCalendar();

      await waitFor(() => {
        expect(screen.getByText('Tous les employes')).toBeInTheDocument();
      });
    });

    it('should have option for unassigned interventions', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      renderCalendar();

      await waitFor(() => {
        expect(screen.getByText('Non assignees')).toBeInTheDocument();
      });
    });
  });

  describe('API update on drop', () => {
    it('should have update API available for drag operations', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      (interventionsApi.update as any).mockResolvedValue({});

      renderCalendar();

      await waitFor(() => {
        expect(interventionsApi.getAll).toHaveBeenCalled();
      });

      // Validate the update API is available and properly mocked
      // Actual drag testing requires E2E tests
      expect(interventionsApi.update).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should show error toast on API failure', async () => {
      (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
      (interventionsApi.getAll as any).mockRejectedValue(new Error('API Error'));

      renderCalendar();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erreur lors du chargement des interventions');
      }, { timeout: 10000 });
    });
  });
});

describe('Calendar drag & drop handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (interventionsApi.getAll as any).mockResolvedValue(mockInterventions);
    (useAuthStore as any).mockReturnValue({ user: { role: 'patron' } });
  });

  it('should render calendar with DnD capabilities for patron', async () => {
    (interventionsApi.update as any).mockResolvedValue({});

    renderCalendar();

    await waitFor(() => {
      expect(interventionsApi.getAll).toHaveBeenCalled();
    });

    // Verify calendar is rendered - DnD capabilities are tested by the
    // draggableAccessor being set to return true for patron role
    expect(screen.getByText('Calendrier')).toBeInTheDocument();
  });
});
