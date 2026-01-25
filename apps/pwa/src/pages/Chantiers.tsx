import { useState } from 'react';

const statusColors: Record<string, string> = {
  lead: 'bg-gray-100 text-gray-800',
  devis_envoye: 'bg-yellow-100 text-yellow-800',
  accepte: 'bg-blue-100 text-blue-800',
  en_cours: 'bg-green-100 text-green-800',
  termine: 'bg-purple-100 text-purple-800',
};

const statusLabels: Record<string, string> = {
  lead: 'Lead',
  devis_envoye: 'Devis envoye',
  accepte: 'Accepte',
  en_cours: 'En cours',
  termine: 'Termine',
};

export function Chantiers() {
  const [filter, setFilter] = useState<string>('all');

  // TODO: Fetch from API
  const chantiers = [
    { id: '1', client: 'Dupont Jean', type: 'Entretien', statut: 'en_cours', ville: 'Angers' },
    { id: '2', client: 'Martin Marie', type: 'Elagage', statut: 'devis_envoye', ville: 'Trelaze' },
    { id: '3', client: 'SCI Les Hauts', type: 'Amenagement', statut: 'accepte', ville: 'Beaucouze' },
    { id: '4', client: 'Dubois Paul', type: 'Abattage', statut: 'lead', ville: 'Angers' },
  ];

  const filteredChantiers =
    filter === 'all' ? chantiers : chantiers.filter((c) => c.statut === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chantiers</h1>
        <button className="btn-primary">+ Nouveau</button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'lead', 'devis_envoye', 'accepte', 'en_cours', 'termine'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {status === 'all' ? 'Tous' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredChantiers.map((chantier) => (
          <div key={chantier.id} className="card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-medium">{chantier.type}</div>
                <div className="text-sm text-gray-600">{chantier.client}</div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${statusColors[chantier.statut]}`}
              >
                {statusLabels[chantier.statut]}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">📍 {chantier.ville}</span>
              <button className="text-primary-600">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
