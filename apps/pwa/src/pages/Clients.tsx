import { useState } from 'react';

export function Clients() {
  const [search, setSearch] = useState('');

  // TODO: Fetch from API
  const clients = [
    { id: '1', nom: 'Dupont', prenom: 'Jean', type: 'particulier', ville: 'Angers' },
    { id: '2', nom: 'Martin', prenom: 'Marie', type: 'particulier', ville: 'Trelaze' },
    { id: '3', nom: 'SCI Les Hauts', prenom: '', type: 'professionnel', ville: 'Beaucouze' },
  ];

  const filteredClients = clients.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.prenom.toLowerCase().includes(search.toLowerCase()) ||
      c.ville.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button className="btn-primary">+ Nouveau</button>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Rechercher un client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {/* List */}
      <div className="space-y-2">
        {filteredClients.map((client) => (
          <div key={client.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">
                {client.prenom} {client.nom}
              </div>
              <div className="text-sm text-gray-600">
                {client.type === 'particulier' ? '👤' : '🏢'} {client.ville}
              </div>
            </div>
            <button className="text-primary-600 text-sm">Voir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
