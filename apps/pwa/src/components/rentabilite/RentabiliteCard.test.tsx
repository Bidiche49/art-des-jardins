import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RentabiliteCard } from './RentabiliteCard';
import type { RentabiliteDto } from '@/services/rentabilite.service';

vi.mock('@/hooks/useRentabilite', () => ({
  useRentabilite: vi.fn(),
}));

import { useRentabilite } from '@/hooks/useRentabilite';

const mockUseRentabilite = useRentabilite as ReturnType<typeof vi.fn>;

const mockRentabiliteProfitable: RentabiliteDto = {
  chantierId: '123',
  chantierNom: 'Chantier Test',
  prevu: {
    montantHT: 10000,
    heuresEstimees: 40,
  },
  reel: {
    heures: 35,
    coutHeures: 1750,
    coutMateriaux: 500,
    coutTotal: 2250,
  },
  marge: {
    montant: 7750,
    pourcentage: 77.5,
  },
  status: 'profitable',
};

const mockRentabiliteLimite: RentabiliteDto = {
  ...mockRentabiliteProfitable,
  marge: {
    montant: 2500,
    pourcentage: 25,
  },
  status: 'limite',
};

const mockRentabilitePerte: RentabiliteDto = {
  ...mockRentabiliteProfitable,
  reel: {
    heures: 100,
    coutHeures: 5000,
    coutMateriaux: 4500,
    coutTotal: 9500,
  },
  marge: {
    montant: 500,
    pourcentage: 5,
  },
  status: 'perte',
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RentabiliteCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" />);
    expect(screen.getByText('Calcul rentabilite...')).toBeInTheDocument();
  });

  it('shows error state when rentabilite is not available', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: null,
      isLoading: false,
      error: new Error('API Error'),
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" />);
    expect(screen.getByText('Rentabilite non disponible')).toBeInTheDocument();
  });

  it('displays profitable status with green badge', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: mockRentabiliteProfitable,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" />);
    expect(screen.getByText('Rentable')).toBeInTheDocument();
    expect(screen.getByText('7 750 €')).toBeInTheDocument();
    expect(screen.getByText('+77.5%')).toBeInTheDocument();
  });

  it('displays limite status with orange badge', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: mockRentabiliteLimite,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" />);
    expect(screen.getByText('Limite')).toBeInTheDocument();
  });

  it('displays perte status with red badge', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: mockRentabilitePerte,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" />);
    expect(screen.getByText('Perte')).toBeInTheDocument();
  });

  it('renders compact version correctly', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: mockRentabiliteProfitable,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" compact />);
    expect(screen.getByText('7 750 €')).toBeInTheDocument();
    expect(screen.getByText('Rentable')).toBeInTheDocument();
    // En mode compact, pas de details supplementaires
    expect(screen.queryByText('Prevu (devis HT)')).not.toBeInTheDocument();
  });

  it('renders full version with more details', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: mockRentabiliteProfitable,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" compact={false} />);
    expect(screen.getByText('Rentabilite')).toBeInTheDocument();
    expect(screen.getByText('Prevu (devis HT)')).toBeInTheDocument();
    expect(screen.getByText('Cout reel')).toBeInTheDocument();
  });

  it('links to rentabilite detail page', () => {
    mockUseRentabilite.mockReturnValue({
      rentabilite: mockRentabiliteProfitable,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter(<RentabiliteCard chantierId="123" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/chantiers/123/rentabilite');
  });
});
