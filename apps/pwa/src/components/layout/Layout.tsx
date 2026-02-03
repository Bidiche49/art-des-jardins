import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { NotificationToggle } from '@/components/NotificationToggle';
import { NotificationBell } from '@/components/NotificationBell';
import { OfflineIndicator } from '@/components/OfflineIndicator';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-full flex flex-col dark:bg-gray-900">
      <header className="bg-primary-600 dark:bg-primary-800 text-white safe-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌿</span>
            <span className="font-semibold">Art & Jardin</span>
            <OfflineIndicator variant="badge" />
          </div>
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <NotificationToggle compact />
            <Link
              to="/settings"
              className="text-primary-100 hover:text-white"
              title="Parametres"
            >
              ⚙️
            </Link>
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

      <main className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>

      <nav className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 safe-bottom shadow-lg">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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
