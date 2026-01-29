import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DevisReadOnly, type DevisPublic } from '../components/signature/DevisReadOnly';
import { SignatureCanvas } from '../components/signature/SignatureCanvas';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DevisResponse {
  alreadySigned: boolean;
  signedAt?: string;
  devis: DevisPublic;
}

interface SignatureResponse {
  success: boolean;
  message: string;
  signedAt: string;
}

type PageState = 'loading' | 'ready' | 'signing' | 'success' | 'error' | 'expired' | 'already_signed';

export function SignerDevis() {
  const { token } = useParams<{ token: string }>();

  const [state, setState] = useState<PageState>('loading');
  const [devis, setDevis] = useState<DevisPublic | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [cgvAccepted, setCgvAccepted] = useState(false);

  // Charger le devis
  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await fetch(`${API_URL}/signature/${token}`);

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 403) {
            setState('expired');
            setError(data.message || 'Ce lien de signature a expire');
          } else if (response.status === 404) {
            setState('error');
            setError('Lien de signature invalide');
          } else {
            setState('error');
            setError(data.message || 'Une erreur est survenue');
          }
          return;
        }

        const data: DevisResponse = await response.json();
        setDevis(data.devis);

        if (data.alreadySigned) {
          setState('already_signed');
          setSignedAt(data.signedAt || null);
        } else {
          setState('ready');
        }
      } catch {
        setState('error');
        setError('Impossible de charger le devis. Verifiez votre connexion.');
      }
    };

    if (token) {
      fetchDevis();
    }
  }, [token]);

  // Gestion du changement de signature
  const handleSignatureChange = useCallback((isEmpty: boolean, dataUrl: string | null) => {
    setSignatureEmpty(isEmpty);
    setSignatureDataUrl(dataUrl);
  }, []);

  // Soumettre la signature
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signatureEmpty || !signatureDataUrl || !cgvAccepted) {
      return;
    }

    setState('signing');

    try {
      const response = await fetch(`${API_URL}/signature/${token}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatureBase64: signatureDataUrl,
          cgvAccepted: true,
        }),
      });

      const data: SignatureResponse = await response.json();

      if (!response.ok) {
        setState('ready');
        setError(data.message || 'Erreur lors de la signature');
        return;
      }

      setSignedAt(data.signedAt);
      setState('success');
    } catch {
      setState('ready');
      setError('Erreur de connexion. Veuillez reessayer.');
    }
  };

  const canSubmit = !signatureEmpty && cgvAccepted && state === 'ready';

  // Page de chargement
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du devis...</p>
        </div>
      </div>
    );
  }

  // Page d'erreur
  if (state === 'error' || state === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {state === 'expired' ? 'Lien expire' : 'Erreur'}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Si vous avez besoin d'assistance, contactez-nous a{' '}
            <a href="mailto:contact@art-et-jardin.fr" className="text-primary-600 hover:underline">
              contact@art-et-jardin.fr
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Page deja signe
  if (state === 'already_signed') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Devis deja signe</h1>
            <p className="text-gray-600">
              Ce devis a ete signe{' '}
              {signedAt && (
                <>
                  le{' '}
                  {new Date(signedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </>
              )}
            </p>
          </div>

          {devis && <DevisReadOnly devis={devis} />}

          <div className="mt-8 text-center">
            <Link to="/" className="text-primary-600 hover:underline">
              Retour
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Page de succes
  if (state === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Merci !</h1>
            <p className="text-lg text-gray-600 mb-2">
              Votre signature a bien ete enregistree.
            </p>
            <p className="text-gray-500">
              Un email de confirmation vous a ete envoye.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-green-800 mb-3">Et maintenant ?</h2>
            <ul className="space-y-2 text-green-700 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Vous allez recevoir un email de confirmation avec le devis signe
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Nous allons vous contacter pour planifier l'intervention
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Un acompte de 30% vous sera demande a la confirmation
              </li>
            </ul>
          </div>

          {devis && <DevisReadOnly devis={devis} />}
        </div>
      </div>
    );
  }

  // Page de signature (state === 'ready' ou 'signing')
  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Signez votre devis
          </h1>
          <p className="text-gray-600">
            Consultez le devis ci-dessous puis signez electroniquement
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {devis && <DevisReadOnly devis={devis} />}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <SignatureCanvas
              onSignatureChange={handleSignatureChange}
              disabled={state === 'signing'}
            />
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={cgvAccepted}
                onChange={(e) => setCgvAccepted(e.target.checked)}
                disabled={state === 'signing'}
                className="mt-1 h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700">
                J'ai lu et j'accepte les{' '}
                <a
                  href="https://art-et-jardin.fr/cgv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Conditions Generales de Vente
                </a>
                . Je confirme ma commande et m'engage a regler le montant indique
                selon les modalites prevues.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
              canSubmit
                ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {state === 'signing' ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signature en cours...
              </span>
            ) : (
              'Signer le devis'
            )}
          </button>

          <p className="text-xs text-center text-gray-500">
            Signature electronique conforme aux articles 1366 et 1367 du Code civil.
            <br />
            Votre adresse IP et la date seront enregistrees.
          </p>
        </form>
      </div>
    </div>
  );
}
