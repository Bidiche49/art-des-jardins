import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';
import { clientMessagingApi, Conversation } from '@/api/messaging';
import { Button } from '@/components/ui';

export function ClientMessages() {
  const { client, logout } = useClientAuthStore();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await clientMessagingApi.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const clientName = client?.prenom
    ? `${client.prenom} ${client.nom}`
    : client?.nom || 'Client';

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return d.toLocaleDateString('fr-FR', { weekday: 'long' });
    }
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/client/dashboard')} className="text-gray-500 hover:text-gray-700">
              ← Retour
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500">Art & Jardin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{clientName}</span>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/client/login'); }}>
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mes conversations</h2>
          <Button onClick={() => setShowNewModal(true)}>
            Nouveau message
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <span className="text-4xl">💬</span>
            <p className="mt-4 text-gray-600">Aucune conversation</p>
            <p className="text-sm text-gray-500 mt-2">
              Demarrez une conversation pour poser une question
            </p>
            <Button className="mt-4" onClick={() => setShowNewModal(true)}>
              Envoyer un message
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/client/messages/${conv.id}`)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {conv.unreadByClient && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                      <p className={`font-medium truncate ${conv.unreadByClient ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conv.subject}
                      </p>
                    </div>
                    {conv.chantier && (
                      <p className="text-xs text-gray-500 mt-1">
                        Chantier: {conv.chantier.description}
                      </p>
                    )}
                    {conv.messages && conv.messages.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {conv.messages[0].content}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                    {formatDate(conv.lastMessageAt)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onCreated={(conv) => {
            setShowNewModal(false);
            navigate(`/client/messages/${conv.id}`);
          }}
        />
      )}
    </div>
  );
}

interface NewConversationModalProps {
  onClose: () => void;
  onCreated: (conversation: Conversation) => void;
}

function NewConversationModal({ onClose, onCreated }: NewConversationModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setLoading(true);
    try {
      const conversation = await clientMessagingApi.createConversation(subject, undefined, message);
      onCreated(conversation);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Nouveau message</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sujet
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ex: Question sur mon devis"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={4}
              placeholder="Ecrivez votre message..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" isLoading={loading}>
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
