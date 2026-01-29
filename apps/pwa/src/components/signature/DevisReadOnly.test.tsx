import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DevisReadOnly, type DevisPublic } from './DevisReadOnly';

const mockDevis: DevisPublic = {
  numero: 'D-2024-0042',
  dateEmission: '2024-01-15T00:00:00.000Z',
  dateValidite: '2024-02-15T00:00:00.000Z',
  totalHT: 166.67,
  totalTVA: 33.33,
  totalTTC: 200.0,
  conditionsParticulieres: 'Acces jardin par le portail lateral.',
  client: {
    nom: 'Jean Dupont',
    adresse: '12 rue des Fleurs',
    codePostal: '49000',
    ville: 'Angers',
  },
  chantier: {
    adresse: '5 avenue des Roses',
    codePostal: '49100',
    ville: 'Bouchemaine',
    description: 'Jardin avant et arriere',
  },
  lignes: [
    {
      description: 'Taille de haie',
      quantite: 1,
      unite: 'forfait',
      prixUnitaireHT: 125.0,
      montantHT: 125.0,
      montantTTC: 150.0,
    },
    {
      description: 'Evacuation dechets verts',
      quantite: 1,
      unite: 'forfait',
      prixUnitaireHT: 41.67,
      montantHT: 41.67,
      montantTTC: 50.0,
    },
  ],
};

describe('DevisReadOnly', () => {
  it('affiche le numero du devis', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText(/D-2024-0042/)).toBeInTheDocument();
  });

  it('affiche le nom du client', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });

  it('affiche l\'adresse du client', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText('12 rue des Fleurs')).toBeInTheDocument();
    expect(screen.getByText('49000 Angers')).toBeInTheDocument();
  });

  it('affiche les dates formatees', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    expect(screen.getByText('15/02/2024')).toBeInTheDocument();
  });

  it('affiche les lignes du devis', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText('Taille de haie')).toBeInTheDocument();
    expect(screen.getByText('Evacuation dechets verts')).toBeInTheDocument();
  });

  it('affiche le total TTC', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText('Total TTC')).toBeInTheDocument();
    expect(screen.getByText('200,00 €')).toBeInTheDocument();
  });

  it('affiche le lieu d\'intervention', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText(/5 avenue des Roses/)).toBeInTheDocument();
    expect(screen.getByText('Jardin avant et arriere')).toBeInTheDocument();
  });

  it('affiche les conditions particulieres', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByText('Acces jardin par le portail lateral.')).toBeInTheDocument();
  });

  it('n\'affiche pas les conditions si absentes', () => {
    const devisSansConditions = { ...mockDevis, conditionsParticulieres: undefined };
    render(<DevisReadOnly devis={devisSansConditions} />);
    expect(screen.queryByText(/Conditions particulieres/i)).not.toBeInTheDocument();
  });

  it('affiche le header Art & Jardin', () => {
    render(<DevisReadOnly devis={mockDevis} />);
    expect(screen.getByRole('heading', { name: 'Art & Jardin' })).toBeInTheDocument();
  });
});
