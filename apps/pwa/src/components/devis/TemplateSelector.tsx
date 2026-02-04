import { useState, useMemo } from 'react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTemplates, useCategories } from '@/hooks';
import { PrestationTemplate } from '@/services/template.service';

interface TemplateSelectorProps {
  isOpen: boolean;
  onSelect: (templates: PrestationTemplate[]) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  entretien: 'Entretien',
  creation: 'Création',
  elagage: 'Élagage',
  divers: 'Divers',
};

const UNIT_LABELS: Record<string, string> = {
  m2: 'm²',
  ml: 'ml',
  h: 'h',
  forfait: 'forfait',
  m3: 'm³',
  unite: 'unité',
};

export function TemplateSelector({ isOpen, onSelect, onClose }: TemplateSelectorProps) {
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { templates, isLoading, error } = useTemplates({
    category: category || undefined,
    search: search || undefined
  });
  const { categories } = useCategories();

  const categoryOptions = useMemo(() => [
    { value: '', label: 'Toutes les catégories' },
    ...categories.map(cat => ({
      value: cat,
      label: CATEGORY_LABELS[cat] || cat,
    })),
  ], [categories]);

  const handleToggle = (templateId: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selected.size === templates.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(templates.map(t => t.id)));
    }
  };

  const handleConfirm = () => {
    const selectedTemplates = templates.filter(t => selected.has(t.id));
    onSelect(selectedTemplates);
    handleClose();
  };

  const handleClose = () => {
    setSelected(new Set());
    setCategory('');
    setSearch('');
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ajouter des prestations"
      size="lg"
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Rechercher une prestation..."
            />
          </div>
          <div className="w-48">
            <Select
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[300px] max-h-[400px] overflow-y-auto border rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <EmptyState
                title="Erreur de chargement"
                description={error.message}
              />
            </div>
          ) : templates.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <EmptyState
                title="Aucune prestation"
                description={search || category
                  ? "Aucune prestation ne correspond à votre recherche"
                  : "Aucun template de prestation n'est disponible"
                }
              />
            </div>
          ) : (
            <div>
              {/* Select all header */}
              <div className="sticky top-0 bg-gray-50 border-b px-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selected.size === templates.length && templates.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>
                    {selected.size === templates.length && templates.length > 0
                      ? 'Tout désélectionner'
                      : 'Tout sélectionner'}
                  </span>
                  <span className="text-gray-400">({templates.length})</span>
                </label>
              </div>

              {/* Template list */}
              <ul className="divide-y">
                {templates.map((template) => (
                  <li key={template.id}>
                    <label className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.has(template.id)}
                        onChange={() => handleToggle(template.id)}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {template.name}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {CATEGORY_LABELS[template.category] || template.category}
                          </span>
                        </div>
                        {template.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {template.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium text-gray-900">
                          {formatPrice(template.unitPriceHT)}
                        </div>
                        <div className="text-xs text-gray-500">
                          /{UNIT_LABELS[template.unit] || template.unit}
                        </div>
                        <div className="text-xs text-gray-400">
                          TVA {template.tvaRate}%
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          Annuler
        </Button>
        <Button onClick={handleConfirm} disabled={selected.size === 0}>
          Ajouter {selected.size > 0 && `(${selected.size})`}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
