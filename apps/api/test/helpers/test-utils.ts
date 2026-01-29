import { randomUUID } from 'crypto';

// User fixtures
export const createMockUser = (overrides = {}) => ({
  id: randomUUID(),
  email: 'test@example.com',
  passwordHash: '$2b$10$hashedpassword',
  nom: 'Dupont',
  prenom: 'Jean',
  telephone: '0601020304',
  role: 'employe' as const,
  actif: true,
  avatarUrl: null,
  derniereConnexion: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockPatron = (overrides = {}) =>
  createMockUser({ role: 'patron', email: 'patron@example.com', ...overrides });

export const createMockEmploye = (overrides = {}) =>
  createMockUser({ role: 'employe', email: 'employe@example.com', ...overrides });

// Client fixtures
export const createMockClient = (overrides = {}) => ({
  id: randomUUID(),
  type: 'particulier' as const,
  nom: 'Martin',
  prenom: 'Pierre',
  raisonSociale: null,
  email: 'client@example.com',
  telephone: '0612345678',
  telephoneSecondaire: null,
  adresse: '123 Rue de la Paix',
  codePostal: '49000',
  ville: 'Angers',
  notes: null,
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockClientPro = (overrides = {}) =>
  createMockClient({
    type: 'professionnel',
    prenom: null,
    raisonSociale: 'Entreprise ABC',
    ...overrides,
  });

export const createMockClientSyndic = (overrides = {}) =>
  createMockClient({
    type: 'syndic',
    raisonSociale: 'Syndic Copropriété',
    ...overrides,
  });

// Chantier fixtures
export const createMockChantier = (clientId: string, overrides = {}) => ({
  id: randomUUID(),
  clientId,
  adresse: '45 Avenue des Fleurs',
  codePostal: '49100',
  ville: 'Angers',
  latitude: 47.4784,
  longitude: -0.5632,
  typePrestation: ['paysagisme', 'entretien'],
  description: 'Aménagement jardin complet',
  surface: 150.5,
  statut: 'lead' as const,
  dateVisite: null,
  dateDebut: null,
  dateFin: null,
  responsableId: null,
  notes: null,
  photos: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Devis fixtures
export const createMockDevis = (chantierId: string, overrides = {}) => ({
  id: randomUUID(),
  chantierId,
  numero: 'DEV-202601-001',
  dateEmission: new Date(),
  dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  totalHT: 1000,
  totalTVA: 200,
  totalTTC: 1200,
  statut: 'brouillon' as const,
  dateAcceptation: null,
  signatureClient: null,
  pdfUrl: null,
  conditionsParticulieres: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockLigneDevis = (devisId: string, overrides = {}) => ({
  id: randomUUID(),
  devisId,
  description: 'Plantation arbustes',
  quantite: 10,
  unite: 'unité',
  prixUnitaireHT: 50,
  tva: 20,
  montantHT: 500,
  montantTTC: 600,
  ordre: 0,
  ...overrides,
});

// Facture fixtures
export const createMockFacture = (devisId: string, overrides = {}) => ({
  id: randomUUID(),
  devisId,
  numero: 'FAC-202601-001',
  dateEmission: new Date(),
  dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  datePaiement: null,
  totalHT: 1000,
  totalTVA: 200,
  totalTTC: 1200,
  statut: 'brouillon' as const,
  modePaiement: null,
  referencePaiement: null,
  pdfUrl: null,
  mentionsLegales: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Intervention fixtures
export const createMockIntervention = (
  chantierId: string,
  employeId: string,
  overrides = {},
) => ({
  id: randomUUID(),
  chantierId,
  employeId,
  date: new Date(),
  heureDebut: new Date(),
  heureFin: null,
  dureeMinutes: null,
  description: 'Tonte pelouse',
  photos: [],
  notes: null,
  valide: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// AuditLog fixtures
export const createMockAuditLog = (overrides = {}) => ({
  id: randomUUID(),
  userId: randomUUID(),
  action: 'CREATE',
  entite: 'Client',
  entiteId: randomUUID(),
  details: { nom: 'Test' },
  ipAddress: '127.0.0.1',
  userAgent: 'Jest Test',
  createdAt: new Date(),
  ...overrides,
});

// Pagination helper
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page = 1,
  limit = 10,
) => ({
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});

// Date helpers
export const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

export const subtractDays = (date: Date, days: number) =>
  new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
