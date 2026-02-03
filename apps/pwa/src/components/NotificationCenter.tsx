import { useNavigate } from 'react-router-dom';
import { useInAppNotificationsStore } from '@/stores/inAppNotifications';
import type { NotificationType, InAppNotification } from '@/api/inAppNotifications';

interface NotificationCenterProps {
  onClose: () => void;
}

const TYPE_ICONS: Record<NotificationType, { icon: string; bgColor: string; textColor: string }> = {
  info: {
    icon: 'ℹ️',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-600 dark:text-yellow-400',
  },
  success: {
    icon: '✅',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400',
  },
  action_required: {
    icon: '🔔',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-600 dark:text-red-400',
  },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'A l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function NotificationItem({
  notification,
  onRead,
  onClick,
}: {
  notification: InAppNotification;
  onRead: () => void;
  onClick: () => void;
}) {
  const typeConfig = TYPE_ICONS[notification.type];
  const isUnread = !notification.readAt;

  const handleClick = () => {
    if (isUnread) {
      onRead();
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${typeConfig.bgColor}`}
        >
          <span className="text-sm">{typeConfig.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-medium truncate ${
                isUnread
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {notification.title}
            </p>
            {isUnread && (
              <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-blue-500 rounded-full" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
      </div>
    </button>
  );
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    isLoadingMore,
    markAsRead,
    markAllAsRead,
    loadMore,
  } = useInAppNotificationsStore();

  const handleNotificationClick = (notification: InAppNotification) => {
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({unreadCount} non lue{unreadCount > 1 ? 's' : ''})
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 mx-auto border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl">🔔</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Aucune notification
            </p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={() => markAsRead(notification.id)}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}

            {/* Load more */}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="w-full p-3 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50"
              >
                {isLoadingMore ? 'Chargement...' : 'Voir plus'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
