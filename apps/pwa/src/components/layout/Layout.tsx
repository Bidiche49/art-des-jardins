import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { NotificationToggle } from '@/components/NotificationToggle';
import { NotificationBell } from '@/components/NotificationBell';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ConnectionIndicator } from '@/components/ui/ConnectionIndicator';
import { OnboardingTour } from '@/components/Onboarding';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';

const navigation = [
  { name: 'Accueil', href: '/', icon: '🏠', dataNav: 'home' },
  { name: 'Clients', href: '/clients', icon: '👥', dataNav: 'clients' },
  { name: 'Chantiers', href: '/chantiers', icon: '🏗️', dataNav: 'chantiers' },
  { name: 'Devis', href: '/devis', icon: '📋', dataNav: 'devis' },
  { name: 'Calendrier', href: '/calendar', icon: '📅', dataNav: 'calendar' },
  { name: 'Analytics', href: '/analytics', icon: '📊', dataNav: 'analytics' },
];

export function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Initialize WebSocket real-time updates
  useRealtimeUpdates();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-full flex flex-col dark:bg-gray-900">
      {/* Onboarding Tour */}
      <OnboardingTour />

      <header className="bg-primary-600 dark:bg-primary-800 text-white safe-top dashboard-header">
        <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-lg sm:text-xl">🌿</span>
            <span className="font-semibold text-sm sm:text-base truncate">Art & Jardin</span>
            <OfflineIndicator variant="badge" />
            <ConnectionIndicator showLabel={false} />
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <NotificationBell />
            <NotificationToggle compact />
            <Link
              to="/settings"
              className="text-primary-100 hover:text-white p-1.5"
              title="Parametres"
            >
              ⚙️
            </Link>
            <span className="text-sm text-primary-100 hidden sm:inline">
              {user?.prenom}
            </span>
            <button
              onClick={handleLogout}
              className="text-primary-100 hover:text-white active:text-white p-1.5"
              title="Deconnexion"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>

      <nav className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 safe-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              data-nav={item.dataNav}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 sm:px-3 min-w-[3rem] min-h-[3rem] text-[10px] sm:text-xs transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500 active:text-gray-600'
                }`
              }
            >
              <span className="text-[1.35rem] sm:text-xl leading-none mb-0.5">{item.icon}</span>
              <span className="leading-tight">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
