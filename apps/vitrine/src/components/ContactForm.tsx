'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { PhotoUpload } from './PhotoUpload';
import { IconSpinner, IconCheck } from '@/lib/icons';

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string;
  website: string; // honeypot
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  service: '',
  message: '',
  website: '', // honeypot - should remain empty
};

/** Normalise un numero de telephone en format E.164 (+33...) */
function normalizePhone(raw: string): string {
  // Garder uniquement chiffres et +
  const digits = raw.replace(/[^\d+]/g, '');
  if (!digits) return '';
  // 0612345678 → +33612345678
  if (digits.startsWith('0') && digits.length === 10) {
    return '+33' + digits.slice(1);
  }
  // +33612345678 → tel quel
  if (digits.startsWith('+')) return digits;
  // 33612345678 (sans +) → +33612345678
  if (digits.startsWith('33') && digits.length === 11) {
    return '+' + digits;
  }
  return digits;
}

const services = [
  { value: '', label: 'Sélectionnez un service' },
  { value: 'paysagisme', label: 'Aménagement paysager / Création de jardin' },
  { value: 'entretien', label: 'Entretien de jardin' },
  { value: 'elagage', label: 'Élagage / Taille d\'arbres' },
  { value: 'abattage', label: 'Abattage / Dessouchage' },
  { value: 'terrasse', label: 'Terrasse / Aménagement extérieur' },
  { value: 'cloture', label: 'Clôture / Portail' },
  { value: 'taille-haies', label: 'Taille de haies' },
  { value: 'debroussaillage', label: 'Débroussaillage / Nettoyage terrain' },
  { value: 'arrosage', label: 'Arrosage automatique' },
  { value: 'autre', label: 'Autre demande' },
];

export function ContactForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'success_no_photos' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [privacy, setPrivacy] = useState(false);

  // Auto-scroll vers le conteneur "Demande de devis gratuit" après succès
  useEffect(() => {
    if (status === 'success' || status === 'success_no_photos') {
      const el = document.getElementById('contact-form-container');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (formData.website) {
      // Silently "succeed" to not alert the bot
      setStatus('success');
      return;
    }

    // Validation par champ
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Le nom est obligatoire.';
    if (!formData.email.trim()) {
      errors.email = 'L\'email est obligatoire.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Veuillez entrer une adresse email valide.';
      }
    }
    if (!formData.message.trim()) errors.message = 'Le message est obligatoire.';
    if (!privacy) errors.privacy = 'Vous devez accepter la politique de confidentialité.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll vers le premier champ en erreur
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const phone = normalizePhone(formData.phone);

    // 1. Tenter l'API NestJS d'abord
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      try {
        const body = new globalThis.FormData();
        body.append('name', formData.name);
        body.append('email', formData.email);
        if (phone) body.append('phone', phone);
        if (formData.city) body.append('city', formData.city);
        if (formData.service) body.append('service', formData.service);
        body.append('message', formData.message);
        if (formData.website) body.append('honeypot', formData.website);
        photos.forEach((photo) => body.append('photos', photo));

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`${apiUrl}/api/v1/contact`, {
          method: 'POST',
          body,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          setStatus('success');
          setFormData(initialFormData);
          setPhotos([]);
          setPrivacy(false);
          return;
        }

        // Erreur client (400, 429) → afficher l'erreur, pas de fallback
        if (response.status === 400 || response.status === 429) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || 'Erreur lors de l\'envoi');
        }
        // Toute autre erreur (404, 5xx) → API absente ou down → fallback Web3Forms
      } catch (err) {
        // Erreur applicative (400, 429) → ne pas fallback
        if (err instanceof Error && err.name !== 'AbortError' && !(err instanceof TypeError)) {
          setErrorMessage(err.message);
          setStatus('error');
          return;
        }
        // AbortError (timeout) ou TypeError (network) → fallback Web3Forms
        console.warn('API unreachable, falling back to Web3Forms');
      }
    }

    // 2. Fallback Web3Forms (plan gratuit : pas de pieces jointes)
    const hadPhotos = photos.length > 0;
    try {
      const body = new globalThis.FormData();
      body.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '');
      body.append('subject', `Nouveau contact Art des Jardins - ${formData.service || 'Demande generale'}`);
      body.append('from_name', formData.name);
      body.append('replyto', formData.email);
      body.append('Nom', formData.name);
      body.append('Email', formData.email);
      body.append('Telephone', phone || 'Non renseigne');
      body.append('Ville', formData.city || 'Non renseigne');
      body.append('Service', formData.service || 'Non precise');
      body.append('Message', formData.message);
      if (hadPhotos) {
        body.append('Photos', `${photos.length} photo(s) jointe(s) - merci de les demander au client`);
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body,
      });

      const data = await response.json();

      if (data.success) {
        setStatus(hadPhotos ? 'success_no_photos' : 'success');
        setFormData(initialFormData);
        setPhotos([]);
        setPrivacy(false);
      } else {
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }
    } catch {
      setErrorMessage(
        'Une erreur est survenue lors de l\'envoi. Veuillez nous contacter par telephone.'
      );
      setStatus('error');
    }
  };

  if (status === 'success' || status === 'success_no_photos') {
    return (
      <div ref={formRef} className="bg-primary-50 border border-primary-200 rounded-xl p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
          <IconCheck className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-primary-800 mb-2">Message envoyé !</h3>
        <p className="text-primary-700">
          Merci pour votre message. Nous vous répondrons sous 48h.
        </p>
        {status === 'success_no_photos' && (
          <p className="text-primary-600 text-sm mt-2">
            Vos photos n'ont pas pu être jointes. Nous vous recontacterons pour les récupérer si nécessaire.
          </p>
        )}
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-primary-600 hover:text-primary-800 underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {status === 'error' && errorMessage && (
        <div ref={formRef} className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Honeypot field - hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="Jean Dupont"
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="jean.dupont@email.fr"
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            inputMode="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            placeholder="06 12 34 56 78"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Ville ou code postal
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            placeholder="Angers, 49000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
          Service souhaité
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white"
        >
          {services.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Votre message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none ${fieldErrors.message ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Décrivez votre projet ou votre demande..."
        />
        {fieldErrors.message && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.message}</p>
        )}
      </div>

      <PhotoUpload files={photos} onChange={setPhotos} />

      <div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy"
            checked={privacy}
            onChange={(e) => {
              setPrivacy(e.target.checked);
              if (fieldErrors.privacy) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.privacy;
                  return next;
                });
              }
            }}
            className={`mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500 ${fieldErrors.privacy ? 'border-red-400' : 'border-gray-300'}`}
          />
          <label htmlFor="privacy" className="text-sm text-gray-600">
            J'accepte que mes données soient traitées pour répondre à ma demande.{' '}
            <a href="/politique-confidentialite/" className="text-primary-600 hover:underline">
              Politique de confidentialité
            </a>
          </label>
        </div>
        {fieldErrors.privacy && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.privacy}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <IconSpinner className="animate-spin h-5 w-5" />
            Envoi en cours...
          </span>
        ) : (
          'Envoyer ma demande'
        )}
      </button>
    </form>
  );
}
