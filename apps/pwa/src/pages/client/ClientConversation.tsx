import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';
import { clientMessagingApi, Conversation, Message } from '@/api/messaging';
import { Button } from '@/components/ui';

export function ClientConversation() {
  const { id } = useParams<{ id: string }>();
  const { logout } = useClientAuthStore();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) loadConversation();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const loadConversation = async () => {
    if (!id) return;
    try {
      const data = await clientMessagingApi.getConversation(id);
      setConversation(data);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newMessage.trim()) return;

    setSending(true);
    try {
      const message = await clientMessagingApi.sendMessage(id, newMessage);
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...(prev.messages || []), message],
        };
      });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach((msg) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msg.createdAt, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-4xl">❌</span>
          <p className="mt-4 text-gray-600">Conversation non trouvee</p>
          <Button onClick={() => navigate('/client/messages')} className="mt-4">
            Retour aux messages
          </Button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(conversation.messages || []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/client/messages')} className="text-gray-500 hover:text-gray-700">
              ← Retour
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{conversation.subject}</h1>
              {conversation.chantier && (
                <p className="text-sm text-gray-500">Chantier: {conversation.chantier.description}</p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/client/login'); }}>
            Deconnexion
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messageGroups.map((group, idx) => (
            <div key={idx}>
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  {formatDate(group.date)}
                </span>
              </div>
              <div className="space-y-4">
                {group.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.senderType === 'client'
                          ? 'bg-green-600 text-white'
                          : 'bg-white shadow text-gray-900'
                      }`}
                    >
                      {msg.senderType === 'entreprise' && (
                        <p className="text-xs font-medium text-green-600 mb-1">Art & Jardin</p>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderType === 'client' ? 'text-green-200' : 'text-gray-400'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t flex-shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ecrivez votre message..."
            />
            <Button type="submit" isLoading={sending} disabled={!newMessage.trim()}>
              Envoyer
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}
