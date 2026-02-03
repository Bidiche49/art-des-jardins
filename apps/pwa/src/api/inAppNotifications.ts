import apiClient from './client';

export type NotificationType = 'info' | 'warning' | 'success' | 'action_required';

export interface InAppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: InAppNotification[];
  total: number;
  hasMore: boolean;
}

export interface NotificationCountResponse {
  unread: number;
  byType: {
    info: number;
    warning: number;
    success: number;
    action_required: number;
  };
}

export interface GetNotificationsParams {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

const inAppNotificationsApi = {
  /**
   * Get notifications for current user
   */
  getNotifications: async (params: GetNotificationsParams = {}): Promise<NotificationListResponse> => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());
    if (params.unreadOnly) searchParams.set('unreadOnly', 'true');
    if (params.type) searchParams.set('type', params.type);

    const query = searchParams.toString();
    const { data } = await apiClient.get<NotificationListResponse>(
      `/in-app-notifications${query ? `?${query}` : ''}`
    );
    return data;
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (): Promise<NotificationCountResponse> => {
    const { data } = await apiClient.get<NotificationCountResponse>('/in-app-notifications/count');
    return data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: string): Promise<InAppNotification> => {
    const { data } = await apiClient.patch<InAppNotification>(`/in-app-notifications/${id}/read`);
    return data;
  },

  /**
   * Mark multiple notifications as read
   */
  markMultipleAsRead: async (ids: string[]): Promise<{ count: number }> => {
    const { data } = await apiClient.post<{ count: number }>('/in-app-notifications/mark-multiple-read', { ids });
    return data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ count: number }> => {
    const { data } = await apiClient.post<{ count: number }>('/in-app-notifications/mark-all-read');
    return data;
  },
};

export default inAppNotificationsApi;
