import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { clientAuthApi } from '@/api/clientAuth';

export function ClientLogin() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await clientAuthApi.requestMagicLink(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <span className="text-5xl">📧</span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Consultez votre boite mail
            </h2>
            <p className="mt-4 text-gray-600">
              Si un compte existe avec l'adresse <strong>{email}</strong>,
              vous recevrez un lien de connexion valable 15 minutes.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Pensez a verifier vos spams.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            className="mt-4"
          >
            Utiliser une autre adresse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <span className="text-5xl">🌿</span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Espace Client</h2>
          <p className="mt-2 text-gray-600">Art & Jardin</p>
          <p className="mt-1 text-sm text-gray-500">
            Entrez votre email pour recevoir un lien de connexion
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            id="email"
            type="email"
            label="Votre adresse email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            autoComplete="email"
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-3"
          >
            Recevoir le lien de connexion
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Pas de mot de passe a retenir - Un lien securise vous sera envoye par email
        </p>
      </div>
    </div>
  );
}
