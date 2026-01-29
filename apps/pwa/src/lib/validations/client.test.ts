import { describe, it, expect } from 'vitest';
import { clientSchema } from './client';

describe('clientSchema', () => {
  const validClient = {
    type: 'particulier',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '0612345678',
    adresse: '123 Rue de la Paix',
    codePostal: '49000',
    ville: 'Angers',
  };

  it('validates a correct particulier client', () => {
    const result = clientSchema.safeParse(validClient);
    expect(result.success).toBe(true);
  });

  it('validates a correct professionnel client', () => {
    const proClient = {
      ...validClient,
      type: 'professionnel',
      raisonSociale: 'ACME Corp',
    };
    const result = clientSchema.safeParse(proClient);
    expect(result.success).toBe(true);
  });

  it('requires a nom', () => {
    const client = { ...validClient, nom: '' };
    const result = clientSchema.safeParse(client);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('nom');
    }
  });

  it('validates email format', () => {
    const client = { ...validClient, email: 'invalid-email' };
    const result = clientSchema.safeParse(client);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('validates code postal format', () => {
    const client = { ...validClient, codePostal: '123' };
    const result = clientSchema.safeParse(client);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('codePostal');
    }
  });

  it('validates telephone format', () => {
    const client = { ...validClient, telephone: 'abc' };
    const result = clientSchema.safeParse(client);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('telephone');
    }
  });

  it('allows optional fields to be undefined', () => {
    const minimalClient = {
      type: 'particulier',
      nom: 'Dupont',
      email: 'jean@example.com',
      telephone: '0612345678',
      adresse: '123 Rue de la Paix',
      codePostal: '49000',
      ville: 'Angers',
    };
    const result = clientSchema.safeParse(minimalClient);
    expect(result.success).toBe(true);
  });
});
