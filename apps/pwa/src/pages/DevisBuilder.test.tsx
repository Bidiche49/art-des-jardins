import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DevisBuilder } from './DevisBuilder';
import type { PrestationTemplate } from '@/services/template.service';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock stores
const mockCreateDevis = vi.fn();
const mockFetchChantiers = vi.fn();
const mockFetchClients = vi.fn();
const mockFetchClientById = vi.fn();

vi.mock('@/stores', () => ({
  useDevisStore: () => ({
    createDevis: mockCreateDevis,
    isLoading: false,
  }),
  useChantiersStore: () => ({
    chantiers: [
      { id: 'chantier-1', adresse: '10 rue Test', ville: 'Angers', clientId: 'client-1' },
    ],
    fetchChantiers: mockFetchChantiers,
  }),
  useClientsStore: () => ({
    clients: [
      { id: 'client-1', type: 'particulier', prenom: 'Jean', nom: 'Dupont', email: 'jean@test.fr' },
    ],
    fetchClients: mockFetchClients,
    fetchClientById: mockFetchClientById,
  }),
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock TemplateSelector
let mockOnSelect: ((templates: PrestationTemplate[]) => void) | null = null;
let mockTemplateSelectorOpen = false;

vi.mock('@/components/devis/TemplateSelector', () => ({
  TemplateSelector: ({ isOpen, onSelect, onClose }: {
    isOpen: boolean;
    onSelect: (templates: PrestationTemplate[]) => void;
    onClose: () => void;
  }) => {
    mockTemplateSelectorOpen = isOpen;
    mockOnSelect = onSelect;
    if (!isOpen) return null;
    return (
      <div data-testid="template-selector-modal">
        <button
          data-testid="select-templates-button"
          onClick={() => {
            onSelect([
              {
                id: 'tpl-1',
                name: 'Tonte pelouse',
                description: 'Tonte et ramassage',
                category: 'entretien',
                unit: 'm2',
                unitPriceHT: 5.5,
                tvaRate: 10,
                isGlobal: true,
                createdBy: null,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
              {
                id: 'tpl-2',
                name: 'Taille haie',
                description: null,
                category: 'entretien',
                unit: 'ml',
                unitPriceHT: 8,
                tvaRate: 20,
                isGlobal: true,
                createdBy: null,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
            ]);
          }}
        >
          Importer selection
        </button>
        <button data-testid="close-modal-button" onClick={onClose}>
          Fermer
        </button>
      </div>
    );
  },
}));

function renderDevisBuilder() {
  return render(
    <BrowserRouter>
      <DevisBuilder />
    </BrowserRouter>
  );
}

describe('DevisBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSelect = null;
    mockTemplateSelectorOpen = false;
  });

  it('should render page title', () => {
    renderDevisBuilder();
    expect(screen.getByText('Nouveau devis')).toBeInTheDocument();
  });

  it('should render chantier select', () => {
    renderDevisBuilder();
    expect(screen.getByText('Chantier')).toBeInTheDocument();
  });

  it('should render date validite input', () => {
    renderDevisBuilder();
    expect(screen.getByText('Date de validite')).toBeInTheDocument();
  });

  it('should render "Importer templates" button', () => {
    renderDevisBuilder();
    expect(screen.getByText('Importer templates')).toBeInTheDocument();
  });

  it('should render "+ Ajouter" button', () => {
    renderDevisBuilder();
    expect(screen.getByText('+ Ajouter')).toBeInTheDocument();
  });

  it('should render one empty ligne by default', () => {
    renderDevisBuilder();
    expect(screen.getByText('Ligne 1')).toBeInTheDocument();
  });

  it('should add new ligne when clicking "+ Ajouter"', () => {
    renderDevisBuilder();
    const addButton = screen.getByText('+ Ajouter');
    fireEvent.click(addButton);
    expect(screen.getByText('Ligne 2')).toBeInTheDocument();
  });

  it('should open TemplateSelector when clicking "Importer templates"', () => {
    renderDevisBuilder();
    const importButton = screen.getByText('Importer templates');
    fireEvent.click(importButton);
    expect(screen.getByTestId('template-selector-modal')).toBeInTheDocument();
  });

  it('should close TemplateSelector when onClose is called', async () => {
    renderDevisBuilder();
    // Open modal
    fireEvent.click(screen.getByText('Importer templates'));
    expect(screen.getByTestId('template-selector-modal')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByTestId('close-modal-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('template-selector-modal')).not.toBeInTheDocument();
    });
  });

  it('should add lignes when templates are imported', async () => {
    renderDevisBuilder();

    // Open modal
    fireEvent.click(screen.getByText('Importer templates'));

    // Import templates
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      // Should have 3 lignes now (1 initial + 2 imported)
      expect(screen.getByText('Ligne 1')).toBeInTheDocument();
      expect(screen.getByText('Ligne 2')).toBeInTheDocument();
      expect(screen.getByText('Ligne 3')).toBeInTheDocument();
    });
  });

  it('should convert template with description to ligne description', async () => {
    renderDevisBuilder();

    fireEvent.click(screen.getByText('Importer templates'));
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      // Template with description should have "name - description"
      const inputs = screen.getAllByPlaceholderText('Description du poste');
      // Second input (Ligne 2) should have the combined description
      expect(inputs[1]).toHaveValue('Tonte pelouse - Tonte et ramassage');
    });
  });

  it('should convert template without description to ligne description', async () => {
    renderDevisBuilder();

    fireEvent.click(screen.getByText('Importer templates'));
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('Description du poste');
      // Third input (Ligne 3) should have just the name
      expect(inputs[2]).toHaveValue('Taille haie');
    });
  });

  it('should set quantite to 1 for imported templates', async () => {
    renderDevisBuilder();

    fireEvent.click(screen.getByText('Importer templates'));
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      const quantiteInputs = screen.getAllByPlaceholderText('Quantite');
      // Imported lignes should have quantite = 1
      expect(quantiteInputs[1]).toHaveValue(1);
      expect(quantiteInputs[2]).toHaveValue(1);
    });
  });

  it('should allow editing imported ligne description', async () => {
    renderDevisBuilder();

    fireEvent.click(screen.getByText('Importer templates'));
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      expect(screen.getByText('Ligne 2')).toBeInTheDocument();
    });

    const inputs = screen.getAllByPlaceholderText('Description du poste');
    fireEvent.change(inputs[1], { target: { value: 'Description modifiee' } });

    expect(inputs[1]).toHaveValue('Description modifiee');
  });

  it('should allow editing imported ligne quantite', async () => {
    renderDevisBuilder();

    fireEvent.click(screen.getByText('Importer templates'));
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      expect(screen.getByText('Ligne 2')).toBeInTheDocument();
    });

    const quantiteInputs = screen.getAllByPlaceholderText('Quantite');
    fireEvent.change(quantiteInputs[1], { target: { value: '5' } });

    expect(quantiteInputs[1]).toHaveValue(5);
  });

  it('should allow editing imported ligne prix', async () => {
    renderDevisBuilder();

    fireEvent.click(screen.getByText('Importer templates'));
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      expect(screen.getByText('Ligne 2')).toBeInTheDocument();
    });

    const prixInputs = screen.getAllByPlaceholderText('Prix unitaire HT');
    fireEvent.change(prixInputs[1], { target: { value: '12.50' } });

    expect(prixInputs[1]).toHaveValue(12.5);
  });

  it('should update totals when templates are imported', async () => {
    renderDevisBuilder();

    fireEvent.click(screen.getByText('Importer templates'));
    fireEvent.click(screen.getByTestId('select-templates-button'));

    await waitFor(() => {
      // Total HT should be 5.5 + 8 = 13.5
      expect(screen.getByText('13.50 €')).toBeInTheDocument();
    });
  });

  it('should render submit buttons', () => {
    renderDevisBuilder();
    expect(screen.getByText('Enregistrer brouillon')).toBeInTheDocument();
    expect(screen.getByText('Creer le devis')).toBeInTheDocument();
  });

  it('should render recapitulatif section', () => {
    renderDevisBuilder();
    expect(screen.getByText('Recapitulatif')).toBeInTheDocument();
    expect(screen.getByText('Total HT')).toBeInTheDocument();
    expect(screen.getByText('Total TVA')).toBeInTheDocument();
    expect(screen.getByText('Total TTC')).toBeInTheDocument();
  });

  it('should call fetchChantiers and fetchClients on mount', () => {
    renderDevisBuilder();
    expect(mockFetchChantiers).toHaveBeenCalled();
    expect(mockFetchClients).toHaveBeenCalled();
  });
});
