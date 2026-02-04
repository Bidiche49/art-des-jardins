import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDevisStore, useChantiersStore, useClientsStore } from '@/stores';
import {
  Button,
  Card,
  CardTitle,
  Input,
  Select,
  Textarea,
  LoadingOverlay,
} from '@/components/ui';
import { TemplateSelector } from '@/components/devis/TemplateSelector';
import type { PrestationTemplate } from '@/services/template.service';
import type { CreateDevisDto } from '@art-et-jardin/shared';
import { format, addMonths } from 'date-fns';
import toast from 'react-hot-toast';

interface LigneDevisForm {
  id: string;
  description: string;
  quantite: number;
  unite: string;
  prixUnitaireHT: number;
  tva: number;
}

const UNITES = [
  { value: 'u', label: 'Unite' },
  { value: 'h', label: 'Heure' },
  { value: 'm2', label: 'm²' },
  { value: 'ml', label: 'ml' },
  { value: 'forfait', label: 'Forfait' },
];

const TVA_RATES = [
  { value: '10', label: 'TVA 10%' },
  { value: '20', label: 'TVA 20%' },
];

function generateTempId() {
  return Math.random().toString(36).substr(2, 9);
}

function templateToDevisLigne(template: PrestationTemplate): LigneDevisForm {
  return {
    id: generateTempId(),
    description: template.description
      ? `${template.name} - ${template.description}`
      : template.name,
    quantite: 1,
    unite: template.unit,
    prixUnitaireHT: template.unitPriceHT,
    tva: template.tvaRate,
  };
}

export function DevisBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedChantierId = searchParams.get('chantierId');

  const { createDevis, isLoading: devisLoading } = useDevisStore();
  const { chantiers, fetchChantiers } = useChantiersStore();
  const { clients, fetchClients, fetchClientById } = useClientsStore();

  const [chantierId, setChantierId] = useState(preselectedChantierId || '');
  const [dateValidite, setDateValidite] = useState(
    format(addMonths(new Date(), 1), 'yyyy-MM-dd')
  );
  const [lignes, setLignes] = useState<LigneDevisForm[]>([
    {
      id: generateTempId(),
      description: '',
      quantite: 1,
      unite: 'u',
      prixUnitaireHT: 0,
      tva: 10,
    },
  ]);
  const [conditionsParticulieres, setConditionsParticulieres] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    fetchChantiers();
    fetchClients();
  }, [fetchChantiers, fetchClients]);

  const selectedChantier = useMemo(
    () => chantiers.find((c) => c.id === chantierId),
    [chantiers, chantierId]
  );

  const selectedClient = useMemo(() => {
    if (!selectedChantier) return null;
    return clients.find((c) => c.id === selectedChantier.clientId);
  }, [selectedChantier, clients]);

  useEffect(() => {
    if (selectedChantier?.clientId) {
      fetchClientById(selectedChantier.clientId);
    }
  }, [selectedChantier?.clientId, fetchClientById]);

  const totals = useMemo(() => {
    let totalHT = 0;
    let totalTVA = 0;

    lignes.forEach((ligne) => {
      const montantHT = ligne.quantite * ligne.prixUnitaireHT;
      const montantTVA = montantHT * (ligne.tva / 100);
      totalHT += montantHT;
      totalTVA += montantTVA;
    });

    return {
      totalHT,
      totalTVA,
      totalTTC: totalHT + totalTVA,
    };
  }, [lignes]);

  const handleAddLigne = () => {
    setLignes([
      ...lignes,
      {
        id: generateTempId(),
        description: '',
        quantite: 1,
        unite: 'u',
        prixUnitaireHT: 0,
        tva: 10,
      },
    ]);
  };

  const handleImportTemplates = (templates: PrestationTemplate[]) => {
    const newLignes = templates.map(templateToDevisLigne);
    setLignes([...lignes, ...newLignes]);
    setShowTemplateSelector(false);
    toast.success(`${templates.length} prestation(s) importee(s)`);
  };

  const handleRemoveLigne = (id: string) => {
    if (lignes.length === 1) return;
    setLignes(lignes.filter((l) => l.id !== id));
  };

  const handleLigneChange = (
    id: string,
    field: keyof LigneDevisForm,
    value: string | number
  ) => {
    setLignes(
      lignes.map((l) =>
        l.id === id
          ? {
              ...l,
              [field]:
                field === 'quantite' || field === 'prixUnitaireHT' || field === 'tva'
                  ? Number(value)
                  : value,
            }
          : l
      )
    );
  };

  const handleSubmit = async (asBrouillon = true) => {
    if (!chantierId) {
      toast.error('Veuillez selectionner un chantier');
      return;
    }

    const validLignes = lignes.filter((l) => l.description && l.prixUnitaireHT > 0);
    if (validLignes.length === 0) {
      toast.error('Ajoutez au moins une ligne valide');
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreateDevisDto = {
        chantierId,
        dateValidite: new Date(dateValidite),
        lignes: validLignes.map((l) => ({
          description: l.description,
          quantite: l.quantite,
          unite: l.unite,
          prixUnitaireHT: l.prixUnitaireHT,
          tva: l.tva,
        })),
        conditionsParticulieres: conditionsParticulieres || undefined,
        notes: notes || undefined,
      };

      const devis = await createDevis(data);
      toast.success(asBrouillon ? 'Brouillon enregistre' : 'Devis cree');
      navigate(`/devis/${devis.id}`);
    } catch {
      toast.error('Erreur lors de la creation du devis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chantierOptions = chantiers.map((c) => ({
    value: c.id,
    label: `${c.adresse}, ${c.ville}`,
  }));

  if (devisLoading && chantiers.length === 0) {
    return <LoadingOverlay message="Chargement..." />;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/devis')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau devis</h1>
      </div>

      <Card>
        <CardTitle>Informations generales</CardTitle>
        <div className="mt-4 space-y-4">
          <Select
            label="Chantier"
            options={chantierOptions}
            placeholder="Selectionner un chantier"
            value={chantierId}
            onChange={(e) => setChantierId(e.target.value)}
            required
          />

          {selectedClient && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Client</div>
              <div className="font-medium">
                {selectedClient.type === 'particulier'
                  ? `${selectedClient.prenom} ${selectedClient.nom}`
                  : selectedClient.raisonSociale || selectedClient.nom}
              </div>
              <div className="text-sm text-gray-500">{selectedClient.email}</div>
            </div>
          )}

          <Input
            label="Date de validite"
            type="date"
            value={dateValidite}
            onChange={(e) => setDateValidite(e.target.value)}
            required
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Lignes du devis</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowTemplateSelector(true)}>
              Importer templates
            </Button>
            <Button size="sm" variant="outline" onClick={handleAddLigne}>
              + Ajouter
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {lignes.map((ligne, index) => (
            <div
              key={ligne.id}
              className="p-4 border rounded-lg bg-gray-50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Ligne {index + 1}
                </span>
                {lignes.length > 1 && (
                  <button
                    onClick={() => handleRemoveLigne(ligne.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer
                  </button>
                )}
              </div>

              <Input
                placeholder="Description du poste"
                value={ligne.description}
                onChange={(e) =>
                  handleLigneChange(ligne.id, 'description', e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Quantite"
                  min="0"
                  step="0.01"
                  value={ligne.quantite}
                  onChange={(e) =>
                    handleLigneChange(ligne.id, 'quantite', e.target.value)
                  }
                />
                <Select
                  options={UNITES}
                  value={ligne.unite}
                  onChange={(e) =>
                    handleLigneChange(ligne.id, 'unite', e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Prix unitaire HT"
                  min="0"
                  step="0.01"
                  value={ligne.prixUnitaireHT}
                  onChange={(e) =>
                    handleLigneChange(ligne.id, 'prixUnitaireHT', e.target.value)
                  }
                />
                <Select
                  options={TVA_RATES}
                  value={String(ligne.tva)}
                  onChange={(e) =>
                    handleLigneChange(ligne.id, 'tva', e.target.value)
                  }
                />
              </div>

              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-500">Montant HT</span>
                <span className="font-medium">
                  {(ligne.quantite * ligne.prixUnitaireHT).toFixed(2)} €
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Recapitulatif</CardTitle>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total HT</span>
            <span className="font-medium">{totals.totalHT.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total TVA</span>
            <span className="font-medium">{totals.totalTVA.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between pt-2 border-t text-lg">
            <span className="font-semibold">Total TTC</span>
            <span className="font-bold text-primary-600">
              {totals.totalTTC.toFixed(2)} €
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Notes et conditions</CardTitle>
        <div className="mt-4 space-y-4">
          <Textarea
            label="Conditions particulieres"
            rows={3}
            value={conditionsParticulieres}
            onChange={(e) => setConditionsParticulieres(e.target.value)}
            placeholder="Ex: Acompte de 30% a la commande..."
          />
          <Textarea
            label="Notes internes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes visibles uniquement en interne..."
          />
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3 safe-bottom">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleSubmit(true)}
          isLoading={isSubmitting}
        >
          Enregistrer brouillon
        </Button>
        <Button
          className="flex-1"
          onClick={() => handleSubmit(false)}
          isLoading={isSubmitting}
        >
          Creer le devis
        </Button>
      </div>

      <TemplateSelector
        isOpen={showTemplateSelector}
        onSelect={handleImportTemplates}
        onClose={() => setShowTemplateSelector(false)}
      />
    </div>
  );
}
