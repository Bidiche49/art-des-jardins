import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { NotificationToggle } from '@/components/NotificationToggle';

const navigation = [
  { name: 'Accueil', href: '/', icon: '🏠' },
  { name: 'Clients', href: '/clients', icon: '👥' },
  { name: 'Chantiers', href: '/chantiers', icon: '🏗️' },
  { name: 'Devis', href: '/devis', icon: '📋' },
  { name: 'Calendrier', href: '/calendar', icon: '📅' },
  { name: 'Analytics', href: '/analytics', icon: '📊' },
];

export function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isOnline, pendingSyncCount } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-full flex flex-col">
      <header className="bg-primary-600 text-white safe-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌿</span>
            <span className="font-semibold">Art & Jardin</span>
            {!isOnline && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-yellow-900 text-xs rounded-full">
                Hors ligne
              </span>
            )}
            {pendingSyncCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {pendingSyncCount} en attente
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <NotificationToggle compact />
            <span className="text-sm text-primary-100">
              {user?.prenom} {user?.nom}
            </span>
            <button
              onClick={handleLogout}
              className="text-primary-100 hover:text-white text-sm"
            >
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 bg-gray-50">
        <Outlet />
      </main>

      <nav className="bg-white border-t safe-bottom shadow-lg">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
