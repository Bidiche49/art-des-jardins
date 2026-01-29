import apiClient from './client';

interface VapidKeyResponse {
  publicKey: string;
}

interface SubscriptionStatus {
  subscribed: boolean;
  subscriptionsCount: number;
}

interface SubscribeDto {
  endpoint: string;
  p256dh: string;
  auth: string;
}

const notificationsApi = {
  getVapidPublicKey: async (): Promise<string> => {
    const { data } = await apiClient.get<VapidKeyResponse>('/notifications/vapid-public-key');
    return data.publicKey;
  },

  subscribe: async (subscription: PushSubscription): Promise<void> => {
    const keys = subscription.toJSON().keys;
    if (!keys) {
      throw new Error('Subscription keys not available');
    }

    const dto: SubscribeDto = {
      endpoint: subscription.endpoint,
      p256dh: keys.p256dh!,
      auth: keys.auth!,
    };

    await apiClient.post('/notifications/subscribe', dto);
  },

  unsubscribe: async (endpoint: string): Promise<void> => {
    await apiClient.delete('/notifications/unsubscribe', {
      data: { endpoint },
    });
  },

  getStatus: async (): Promise<SubscriptionStatus> => {
    const { data } = await apiClient.get<SubscriptionStatus>('/notifications/status');
    return data;
  },

  sendTest: async (): Promise<void> => {
    await apiClient.post('/notifications/send/test');
  },
};

export default notificationsApi;
