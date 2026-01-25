import { useAuthStore } from '@/stores/auth';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.prenom} !
        </h1>
        <p className="text-gray-600">Voici un apercu de votre activite</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-gray-600">Clients</div>
        </div>
        <div className="card">
          <div className="text-3xl mb-2">🏗️</div>
          <div className="text-2xl font-bold">5</div>
          <div className="text-sm text-gray-600">Chantiers en cours</div>
        </div>
        <div className="card">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-gray-600">Devis en attente</div>
        </div>
        <div className="card">
          <div className="text-3xl mb-2">💶</div>
          <div className="text-2xl font-bold">2.4k</div>
          <div className="text-sm text-gray-600">CA du mois</div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Prochains chantiers</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <div className="font-medium">Entretien jardin</div>
              <div className="text-sm text-gray-600">M. Dupont - Angers</div>
            </div>
            <div className="text-sm text-gray-500">Demain</div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <div className="font-medium">Elagage</div>
              <div className="text-sm text-gray-600">Mme Martin - Trelaze</div>
            </div>
            <div className="text-sm text-gray-500">Lundi</div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Amenagement</div>
              <div className="text-sm text-gray-600">SCI Les Hauts - Beaucouze</div>
            </div>
            <div className="text-sm text-gray-500">Mardi</div>
          </div>
        </div>
      </div>
    </div>
  );
}
