export interface DevisPublic {
  numero: string;
  dateEmission: string;
  dateValidite: string;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  conditionsParticulieres?: string;
  client: {
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
  };
  chantier: {
    adresse: string;
    codePostal: string;
    ville: string;
    description?: string;
  };
  lignes: {
    description: string;
    quantite: number;
    unite: string;
    prixUnitaireHT: number;
    montantHT: number;
    montantTTC: number;
  }[];
}

interface DevisReadOnlyProps {
  devis: DevisPublic;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function DevisReadOnly({ devis }: DevisReadOnlyProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tete */}
      <div className="bg-primary-600 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Art & Jardin</h2>
            <p className="text-primary-100 text-sm">Paysagiste</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">DEVIS</p>
            <p className="text-primary-100">N° {devis.numero}</p>
          </div>
        </div>
      </div>

      {/* Infos client et dates */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Client
            </h3>
            <p className="font-medium">{devis.client.nom}</p>
            <p className="text-gray-600 text-sm">{devis.client.adresse}</p>
            <p className="text-gray-600 text-sm">
              {devis.client.codePostal} {devis.client.ville}
            </p>
          </div>
          <div className="md:text-right">
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Date :</span>{' '}
                <span className="font-medium">{formatDate(devis.dateEmission)}</span>
              </p>
              <p>
                <span className="text-gray-500">Valide jusqu'au :</span>{' '}
                <span className="font-medium">{formatDate(devis.dateValidite)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lieu d'intervention */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Lieu d'intervention
        </h3>
        <p className="text-sm text-gray-700">
          {devis.chantier.adresse}, {devis.chantier.codePostal} {devis.chantier.ville}
        </p>
        {devis.chantier.description && (
          <p className="text-sm text-gray-600 mt-1">{devis.chantier.description}</p>
        )}
      </div>

      {/* Lignes du devis */}
      <div className="px-6 py-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Prestations
        </h3>
        <div className="space-y-3">
          {devis.lignes.map((ligne, index) => (
            <div
              key={index}
              className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1 pr-4">
                <p className="font-medium text-gray-900">{ligne.description}</p>
                <p className="text-sm text-gray-500">
                  {ligne.quantite} {ligne.unite} x {formatCurrency(ligne.prixUnitaireHT)} HT
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(ligne.montantTTC)}</p>
                <p className="text-xs text-gray-500">TTC</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totaux */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total HT</span>
            <span className="font-medium">{formatCurrency(devis.totalHT)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">TVA (20%)</span>
            <span className="font-medium">{formatCurrency(devis.totalTVA)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span>Total TTC</span>
            <span className="text-primary-600">{formatCurrency(devis.totalTTC)}</span>
          </div>
        </div>
      </div>

      {/* Conditions particulieres */}
      {devis.conditionsParticulieres && (
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Conditions particulieres
          </h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {devis.conditionsParticulieres}
          </p>
        </div>
      )}
    </div>
  );
}
