'use client';

import { useState, FormEvent } from 'react';
import { PhotoUpload } from './PhotoUpload';
import { IconSpinner } from '@/lib/icons';

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

const services = [
  { value: '', label: 'Sélectionnez un service' },
  { value: 'paysagisme', label: 'Aménagement paysager / Création de jardin' },
  { value: 'entretien', label: 'Entretien de jardin' },
  { value: 'elagage', label: 'Élagage / Taille d\'arbres' },
  { value: 'abattage', label: 'Abattage / Dessouchage' },
  { value: 'autre', label: 'Autre demande' },
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'success_no_photos' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (formData.website) {
      // Silently "succeed" to not alert the bot
      setStatus('success');
      return;
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      setStatus('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Veuillez entrer une adresse email valide.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // 1. Tenter l'API NestJS d'abord
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      try {
        const body = new globalThis.FormData();
        body.append('name', formData.name);
        body.append('email', formData.email);
        if (formData.phone) body.append('phone', formData.phone);
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
      body.append('Telephone', formData.phone || 'Non renseigne');
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Message envoyé !</h3>
        <p className="text-green-700">
          Merci pour votre message. Nous vous répondrons sous 48h.
        </p>
        {status === 'success_no_photos' && (
          <p className="text-green-600 text-sm mt-2">
            Vos photos n'ont pas pu être jointes. Nous vous recontacterons pour les récupérer si nécessaire.
          </p>
        )}
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-green-600 hover:text-green-800 underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
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

      <div className="grid md:grid-cols-2 gap-6">
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
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            placeholder="Jean Dupont"
          />
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
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            placeholder="jean.dupont@email.fr"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
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
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
          placeholder="Décrivez votre projet ou votre demande..."
        />
      </div>

      <PhotoUpload files={photos} onChange={setPhotos} />

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy"
          required
          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="privacy" className="text-sm text-gray-600">
          J'accepte que mes données soient traitées pour répondre à ma demande.{' '}
          <a href="/politique-confidentialite/" className="text-primary-600 hover:underline">
            Politique de confidentialité
          </a>
        </label>
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
