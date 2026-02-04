import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TemplateSelector } from './TemplateSelector';
import { templateService, PrestationTemplate } from '@/services/template.service';

vi.mock('@/services/template.service', () => ({
  templateService: {
    getAll: vi.fn(),
    getCategories: vi.fn(),
  },
}));

const mockTemplates: PrestationTemplate[] = [
  {
    id: '1',
    name: 'Tonte pelouse',
    description: 'Tonte de la pelouse avec ramassage',
    category: 'entretien',
    unit: 'm2',
    unitPriceHT: 2.5,
    tvaRate: 20,
    isGlobal: true,
    createdBy: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Taille de haie',
    description: 'Taille et évacuation des déchets',
    category: 'entretien',
    unit: 'ml',
    unitPriceHT: 8.0,
    tvaRate: 20,
    isGlobal: true,
    createdBy: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Abattage arbre',
    description: 'Abattage et évacuation',
    category: 'elagage',
    unit: 'forfait',
    unitPriceHT: 450.0,
    tvaRate: 20,
    isGlobal: true,
    createdBy: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

describe('TemplateSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(templateService.getAll).mockResolvedValue(mockTemplates);
    vi.mocked(templateService.getCategories).mockResolvedValue(['entretien', 'elagage', 'creation', 'divers']);
  });

  it('does not render when isOpen is false', () => {
    render(
      <TemplateSelector
        isOpen={false}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.queryByText('Ajouter des prestations')).not.toBeInTheDocument();
  });

  it('renders modal when isOpen is true', async () => {
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Ajouter des prestations')).toBeInTheDocument();
  });

  it('displays templates after loading', async () => {
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    expect(screen.getByText('Taille de haie')).toBeInTheDocument();
    expect(screen.getByText('Abattage arbre')).toBeInTheDocument();
  });

  it('displays template details correctly', async () => {
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    expect(screen.getByText('Tonte de la pelouse avec ramassage')).toBeInTheDocument();
    expect(screen.getByText('2,50 €')).toBeInTheDocument();
    expect(screen.getByText('/m²')).toBeInTheDocument();
  });

  it('allows selecting templates', async () => {
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First template checkbox (skip select all)

    expect(screen.getByText('Ajouter (1)')).toBeInTheDocument();
  });

  it('allows selecting all templates', async () => {
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);

    expect(screen.getByText('Ajouter (3)')).toBeInTheDocument();
  });

  it('calls onSelect with selected templates', async () => {
    const handleSelect = vi.fn();
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={handleSelect}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first template

    const addButton = screen.getByText('Ajouter (1)');
    fireEvent.click(addButton);

    expect(handleSelect).toHaveBeenCalledWith([mockTemplates[0]]);
  });

  it('calls onClose when cancel is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={handleClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Annuler')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Annuler'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('disables add button when nothing is selected', async () => {
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: 'Ajouter' });
    expect(addButton).toBeDisabled();
  });

  it('filters by search input', async () => {
    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Rechercher une prestation...');
    fireEvent.change(searchInput, { target: { value: 'Tonte' } });

    await waitFor(() => {
      expect(templateService.getAll).toHaveBeenCalledWith({
        category: undefined,
        search: 'Tonte',
      });
    });
  });

  it('shows empty state when no templates match', async () => {
    vi.mocked(templateService.getAll).mockResolvedValue([]);

    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Aucune prestation')).toBeInTheDocument();
    });
  });

  it('shows error state when loading fails', async () => {
    vi.mocked(templateService.getAll).mockRejectedValue(new Error('Erreur réseau'));

    render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    });
  });

  it('resets selection when modal is closed', async () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={handleClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    // Select a template
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(screen.getByText('Ajouter (1)')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Annuler'));

    // Reopen modal
    rerender(
      <TemplateSelector
        isOpen={true}
        onSelect={() => {}}
        onClose={handleClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Tonte pelouse')).toBeInTheDocument();
    });

    // Button should show just "Ajouter" without count
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled();
  });
});
