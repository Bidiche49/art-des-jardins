import { Test, TestingModule } from '@nestjs/testing';
import { ClientPortalService } from './client-portal.service';
import { PrismaService } from '../../database/prisma.service';

describe('ClientPortalService', () => {
  let service: ClientPortalService;

  const mockClient = {
    id: 'client-123',
    email: 'client@example.com',
    nom: 'Dupont',
    prenom: 'Jean',
    type: 'PARTICULIER',
    chantiers: [
      {
        id: 'chantier-1',
        description: 'Aménagement jardin',
        statut: 'en_cours',
        adresse: '123 rue Test',
        codePostal: '49000',
        ville: 'Angers',
        devis: [
          {
            id: 'devis-1',
            numero: 'D-2026-001',
            statut: 'signe',
            totalTTC: 5000,
            factures: [
              { id: 'facture-1', statut: 'envoyee', totalTTC: 2500 },
              { id: 'facture-2', statut: 'payee', totalTTC: 2500 },
            ],
          },
          {
            id: 'devis-2',
            numero: 'D-2026-002',
            statut: 'envoye',
            totalTTC: 3000,
            factures: [],
          },
        ],
      },
    ],
  };

  const mockPrismaService = {
    client: {
      findUnique: jest.fn(),
    },
    chantier: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    devis: {
      findFirst: jest.fn(),
    },
    facture: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientPortalService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClientPortalService>(ClientPortalService);
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('should return empty stats when client not found', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      const result = await service.getDashboard('unknown-client');

      expect(result.devis.total).toBe(0);
      expect(result.factures.aPayer).toBe(0);
      expect(result.chantiers).toHaveLength(0);
    });

    it('should calculate correct dashboard stats', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.getDashboard('client-123');

      expect(result.devis.enAttente).toBe(1);
      expect(result.devis.acceptes).toBe(1);
      expect(result.devis.total).toBe(2);
      expect(result.factures.aPayer).toBe(1);
      expect(result.factures.payees).toBe(1);
      expect(result.factures.montantDu).toBe(2500);
      expect(result.chantiers).toHaveLength(1);
      expect(result.chantiers[0].id).toBe('chantier-1');
    });
  });

  describe('getDevis', () => {
    it('should return devis with chantier info', async () => {
      mockPrismaService.chantier.findMany.mockResolvedValue([
        {
          id: 'chantier-1',
          description: 'Aménagement jardin',
          adresse: '123 rue Test',
          codePostal: '49000',
          ville: 'Angers',
          devis: [
            {
              id: 'devis-1',
              numero: 'D-2026-001',
              statut: 'signe',
              totalTTC: 5000,
              lignes: [],
              signature: null,
            },
          ],
        },
      ]);

      const result = await service.getDevis('client-123');

      expect(result).toHaveLength(1);
      expect(result[0].chantierDescription).toBe('Aménagement jardin');
      expect(result[0].chantierAdresse).toBe('123 rue Test, 49000 Angers');
    });
  });

  describe('getDevisById', () => {
    it('should return devis with details for client owner', async () => {
      mockPrismaService.devis.findFirst.mockResolvedValue({
        id: 'devis-1',
        numero: 'D-2026-001',
        lignes: [],
        chantier: { clientId: 'client-123' },
      });

      const result = await service.getDevisById('client-123', 'devis-1');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('devis-1');
    });

    it('should return null for devis not owned by client', async () => {
      mockPrismaService.devis.findFirst.mockResolvedValue(null);

      const result = await service.getDevisById('client-123', 'devis-other');

      expect(result).toBeNull();
    });
  });

  describe('getFactures', () => {
    it('should return factures with devis and chantier info', async () => {
      mockPrismaService.chantier.findMany.mockResolvedValue([
        {
          devis: [
            {
              numero: 'D-2026-001',
              factures: [
                { id: 'facture-1', numero: 'F-2026-001', totalTTC: 2500, lignes: [] },
              ],
            },
          ],
          description: 'Aménagement jardin',
        },
      ]);

      const result = await service.getFactures('client-123');

      expect(result).toHaveLength(1);
      expect(result[0].devisNumero).toBe('D-2026-001');
      expect(result[0].chantierDescription).toBe('Aménagement jardin');
    });
  });

  describe('getChantiers', () => {
    it('should return chantiers with recent interventions', async () => {
      mockPrismaService.chantier.findMany.mockResolvedValue([
        {
          id: 'chantier-1',
          description: 'Aménagement jardin',
          statut: 'en_cours',
          interventions: [{ id: 'int-1', date: new Date() }],
        },
      ]);

      const result = await service.getChantiers('client-123');

      expect(result).toHaveLength(1);
      expect(result[0].interventions).toHaveLength(1);
    });
  });

  describe('getChantierById', () => {
    it('should return chantier with full details for client owner', async () => {
      mockPrismaService.chantier.findFirst.mockResolvedValue({
        id: 'chantier-1',
        clientId: 'client-123',
        interventions: [],
        devis: [],
      });

      const result = await service.getChantierById('client-123', 'chantier-1');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('chantier-1');
    });
  });
});
