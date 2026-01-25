import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Clients', href: '/clients', icon: '👥' },
  { name: 'Chantiers', href: '/chantiers', icon: '🏗️' },
];

export function Layout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-primary-600 text-white safe-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌿</span>
            <span className="font-semibold">Art & Jardin</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-primary-100">
              {user?.prenom} {user?.nom}
            </span>
            <button
              onClick={logout}
              className="text-primary-100 hover:text-white text-sm"
            >
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t safe-bottom">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 text-xs ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
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
