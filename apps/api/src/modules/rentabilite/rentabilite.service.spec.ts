import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RentabiliteService } from './rentabilite.service';
import { PrismaService } from '../../database/prisma.service';
import { randomUUID } from 'crypto';

// Mock Decimal class for tests
class MockDecimal {
  private value: number;
  constructor(value: number | string) {
    this.value = typeof value === 'string' ? parseFloat(value) : value;
  }
  toNumber(): number {
    return this.value;
  }
}

describe('RentabiliteService', () => {
  let service: RentabiliteService;
  let mockChantierFindUnique: jest.Mock;
  let mockChantierFindMany: jest.Mock;

  const chantierId = randomUUID();
  const clientId = randomUUID();
  const userId = randomUUID();
  const devisId = randomUUID();
  const interventionId = randomUUID();

  const createMockChantierWithData = (overrides = {}) => ({
    id: chantierId,
    adresse: '45 Avenue des Fleurs',
    codePostal: '49100',
    ville: 'Angers',
    deletedAt: null,
    client: {
      nom: 'Martin',
      prenom: 'Pierre',
      raisonSociale: null,
    },
    devis: [
      {
        id: devisId,
        totalHT: 5000,
        statut: 'accepte',
      },
    ],
    interventions: [
      {
        id: interventionId,
        timeEntries: [
          {
            id: randomUUID(),
            hours: new MockDecimal(8),
            user: { hourlyRate: new MockDecimal(30) },
          },
          {
            id: randomUUID(),
            hours: new MockDecimal(6),
            user: { hourlyRate: new MockDecimal(25) },
          },
        ],
      },
    ],
    materialUsages: [
      {
        id: randomUUID(),
        totalCost: new MockDecimal(500),
      },
      {
        id: randomUUID(),
        totalCost: new MockDecimal(300),
      },
    ],
    ...overrides,
  });

  beforeEach(async () => {
    mockChantierFindUnique = jest.fn();
    mockChantierFindMany = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentabiliteService,
        {
          provide: PrismaService,
          useValue: {
            chantier: {
              findUnique: mockChantierFindUnique,
              findMany: mockChantierFindMany,
            },
          },
        },
      ],
    }).compile();

    service = module.get<RentabiliteService>(RentabiliteService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculerRentabilite', () => {
    it('should calculate rentability correctly for a profitable project', async () => {
      // 8h * 30€ + 6h * 25€ = 240 + 150 = 390€ heures
      // 500 + 300 = 800€ materiaux
      // Total cout = 1190€
      // Marge = 5000 - 1190 = 3810€
      // Pourcentage = 76.2%
      const mockChantier = createMockChantierWithData();
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.chantierId).toBe(chantierId);
      expect(result.chantierNom).toBe('45 Avenue des Fleurs, Angers');
      expect(result.clientNom).toBe('Pierre Martin');
      expect(result.prevu.montantHT).toBe(5000);
      expect(result.reel.heures).toBe(14);
      expect(result.reel.coutHeures).toBe(390);
      expect(result.reel.coutMateriaux).toBe(800);
      expect(result.reel.coutTotal).toBe(1190);
      expect(result.marge.montant).toBe(3810);
      expect(result.marge.pourcentage).toBe(76.2);
      expect(result.status).toBe('profitable');
    });

    it('should return status "limite" when margin is between 15% and 30%', async () => {
      // Devis 1000€, cout 780€ = marge 220€ = 22%
      const mockChantier = createMockChantierWithData({
        devis: [{ id: devisId, totalHT: 1000, statut: 'accepte' }],
        interventions: [
          {
            id: interventionId,
            timeEntries: [
              {
                id: randomUUID(),
                hours: new MockDecimal(10),
                user: { hourlyRate: new MockDecimal(28) },
              },
            ],
          },
        ],
        materialUsages: [{ id: randomUUID(), totalCost: new MockDecimal(500) }],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.status).toBe('limite');
      expect(result.marge.pourcentage).toBeGreaterThanOrEqual(15);
      expect(result.marge.pourcentage).toBeLessThan(30);
    });

    it('should return status "perte" when margin is below 15%', async () => {
      // Devis 1000€, cout 900€ = marge 100€ = 10%
      const mockChantier = createMockChantierWithData({
        devis: [{ id: devisId, totalHT: 1000, statut: 'accepte' }],
        interventions: [
          {
            id: interventionId,
            timeEntries: [
              {
                id: randomUUID(),
                hours: new MockDecimal(20),
                user: { hourlyRate: new MockDecimal(20) },
              },
            ],
          },
        ],
        materialUsages: [{ id: randomUUID(), totalCost: new MockDecimal(500) }],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.status).toBe('perte');
      expect(result.marge.pourcentage).toBeLessThan(15);
    });

    it('should return status "indetermine" when no devis is available', async () => {
      const mockChantier = createMockChantierWithData({
        devis: [],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.status).toBe('indetermine');
      expect(result.prevu.montantHT).toBeNull();
      expect(result.marge.montant).toBeNull();
      expect(result.marge.pourcentage).toBeNull();
    });

    it('should use default hourly rate of 25€ when user has no rate', async () => {
      const mockChantier = createMockChantierWithData({
        interventions: [
          {
            id: interventionId,
            timeEntries: [
              {
                id: randomUUID(),
                hours: new MockDecimal(4),
                user: { hourlyRate: null },
              },
            ],
          },
        ],
        materialUsages: [],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      // 4h * 25€ = 100€
      expect(result.reel.coutHeures).toBe(100);
    });

    it('should handle chantier with no interventions or materials', async () => {
      const mockChantier = createMockChantierWithData({
        interventions: [],
        materialUsages: [],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.reel.heures).toBe(0);
      expect(result.reel.coutHeures).toBe(0);
      expect(result.reel.coutMateriaux).toBe(0);
      expect(result.reel.coutTotal).toBe(0);
      expect(result.marge.montant).toBe(5000);
      expect(result.marge.pourcentage).toBe(100);
    });

    it('should use raisonSociale for professional clients', async () => {
      const mockChantier = createMockChantierWithData({
        client: {
          nom: 'Martin',
          prenom: null,
          raisonSociale: 'Entreprise ABC',
        },
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.clientNom).toBe('Entreprise ABC');
    });

    it('should throw NotFoundException when chantier not found', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(service.calculerRentabilite(chantierId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.calculerRentabilite(chantierId)).rejects.toThrow(
        `Chantier ${chantierId} non trouve`,
      );
    });
  });

  describe('genererRapport', () => {
    it('should generate a report for all chantiers with accepted devis', async () => {
      const chantier1Id = randomUUID();
      const chantier2Id = randomUUID();

      mockChantierFindMany.mockResolvedValue([
        { id: chantier1Id },
        { id: chantier2Id },
      ]);

      // Mock for calculerRentabilite calls
      mockChantierFindUnique
        .mockResolvedValueOnce(
          createMockChantierWithData({ id: chantier1Id }),
        )
        .mockResolvedValueOnce(
          createMockChantierWithData({
            id: chantier2Id,
            adresse: '10 Rue du Parc',
          }),
        );

      const result = await service.genererRapport();

      expect(result).toHaveLength(2);
      expect(mockChantierFindMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          devis: {
            some: {
              statut: { in: ['accepte', 'signe'] },
            },
          },
        },
        select: { id: true },
        orderBy: { dateDebut: 'desc' },
      });
    });

    it('should filter chantiers by date range', async () => {
      mockChantierFindMany.mockResolvedValue([]);

      await service.genererRapport('2026-01-01', '2026-01-31');

      expect(mockChantierFindMany).toHaveBeenCalledWith({
        where: {
          dateDebut: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
          deletedAt: null,
          devis: {
            some: {
              statut: { in: ['accepte', 'signe'] },
            },
          },
        },
        select: { id: true },
        orderBy: { dateDebut: 'desc' },
      });
    });

    it('should filter chantiers by dateDebut only', async () => {
      mockChantierFindMany.mockResolvedValue([]);

      await service.genererRapport('2026-01-01');

      expect(mockChantierFindMany).toHaveBeenCalledWith({
        where: {
          dateDebut: {
            gte: expect.any(Date),
          },
          deletedAt: null,
          devis: {
            some: {
              statut: { in: ['accepte', 'signe'] },
            },
          },
        },
        select: { id: true },
        orderBy: { dateDebut: 'desc' },
      });
    });

    it('should return empty array when no chantiers found', async () => {
      mockChantierFindMany.mockResolvedValue([]);

      const result = await service.genererRapport();

      expect(result).toEqual([]);
    });
  });

  describe('status determination', () => {
    it('should return "profitable" when margin >= 30%', async () => {
      // Devis 1000€, cout 600€ = marge 400€ = 40%
      const mockChantier = createMockChantierWithData({
        devis: [{ id: devisId, totalHT: 1000, statut: 'accepte' }],
        interventions: [],
        materialUsages: [{ id: randomUUID(), totalCost: new MockDecimal(600) }],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.status).toBe('profitable');
    });

    it('should return "limite" when margin is exactly 15%', async () => {
      // Devis 1000€, cout 850€ = marge 150€ = 15%
      const mockChantier = createMockChantierWithData({
        devis: [{ id: devisId, totalHT: 1000, statut: 'accepte' }],
        interventions: [],
        materialUsages: [{ id: randomUUID(), totalCost: new MockDecimal(850) }],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      expect(result.status).toBe('limite');
    });

    it('should return "limite" when margin is exactly 30%', async () => {
      // Devis 1000€, cout 700€ = marge 300€ = 30%
      const mockChantier = createMockChantierWithData({
        devis: [{ id: devisId, totalHT: 1000, statut: 'accepte' }],
        interventions: [],
        materialUsages: [{ id: randomUUID(), totalCost: new MockDecimal(700) }],
      });
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const result = await service.calculerRentabilite(chantierId);

      // 30% = seuil PROFITABLE, donc status devrait etre "profitable"
      expect(result.status).toBe('profitable');
    });
  });
});
