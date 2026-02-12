import axios from 'axios';
import { useClientAuthStore } from '@/stores/clientAuth';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : `${window.location.origin}`);

const messagingApi = axios.create({
  baseURL: `${API_URL}/api/v1/client-messaging`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

messagingApi.interceptors.request.use((config) => {
  const { accessToken } = useClientAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

messagingApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useClientAuthStore.getState().logout();
      window.location.href = '/client/login';
    }
    return Promise.reject(error);
  }
);

export interface Message {
  id: string;
  senderType: 'client' | 'entreprise';
  senderId: string | null;
  content: string;
  attachments: string[];
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  subject: string;
  lastMessageAt: string;
  unreadByClient: boolean;
  chantier?: { id: string; description: string } | null;
  messages?: Message[];
  client?: { id: string; nom: string; prenom: string | null };
}

export const clientMessagingApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await messagingApi.get('/conversations');
    return response.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await messagingApi.get(`/conversations/${id}`);
    return response.data;
  },

  createConversation: async (
    subject: string,
    chantierId?: string,
    message?: string,
  ): Promise<Conversation> => {
    const response = await messagingApi.post('/conversations', {
      subject,
      chantierId,
      message,
    });
    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    content: string,
    attachments?: string[],
  ): Promise<Message> => {
    const response = await messagingApi.post(`/conversations/${conversationId}/messages`, {
      content,
      attachments,
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await messagingApi.get('/unread-count');
    return response.data;
  },
};
