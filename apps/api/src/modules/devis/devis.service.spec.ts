import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DevisService } from './devis.service';
import { PrismaService } from '../../database/prisma.service';
import {
  createMockDevis,
  createMockChantier,
} from '../../../test/helpers/test-utils';

describe('DevisService', () => {
  let service: DevisService;
  let mockDevisFindMany: jest.Mock;
  let mockDevisFindUnique: jest.Mock;
  let mockDevisCreate: jest.Mock;
  let mockDevisUpdate: jest.Mock;
  let mockDevisDelete: jest.Mock;
  let mockDevisCount: jest.Mock;
  let mockChantierFindUnique: jest.Mock;
  let mockLigneDevisDeleteMany: jest.Mock;
  let mockSequenceUpsert: jest.Mock;

  const chantierId = 'chantier-123';
  const mockChantier = createMockChantier('client-123', { id: chantierId });
  const mockDevisData = createMockDevis(chantierId, {
    id: 'devis-123',
    statut: 'brouillon',
  });

  beforeEach(async () => {
    mockDevisFindMany = jest.fn();
    mockDevisFindUnique = jest.fn();
    mockDevisCreate = jest.fn();
    mockDevisUpdate = jest.fn();
    mockDevisDelete = jest.fn();
    mockDevisCount = jest.fn();
    mockChantierFindUnique = jest.fn();
    mockLigneDevisDeleteMany = jest.fn();
    mockSequenceUpsert = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevisService,
        {
          provide: PrismaService,
          useValue: {
            devis: {
              findMany: mockDevisFindMany,
              findUnique: mockDevisFindUnique,
              create: mockDevisCreate,
              update: mockDevisUpdate,
              delete: mockDevisDelete,
              count: mockDevisCount,
            },
            chantier: {
              findUnique: mockChantierFindUnique,
            },
            ligneDevis: {
              deleteMany: mockLigneDevisDeleteMany,
            },
            sequence: {
              upsert: mockSequenceUpsert,
            },
          },
        },
      ],
    }).compile();

    service = module.get<DevisService>(DevisService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Calculation tests', () => {
    it('should calculate line HT correctly (quantite * prixUnitaireHT)', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => {
        return Promise.resolve({
          ...mockDevisData,
          ...data,
          lignes: data.lignes.create,
        });
      });

      const createDto = {
        chantierId,
        lignes: [
          {
            description: 'Test',
            quantite: 5,
            unite: 'unité',
            prixUnitaireHT: 100,
          },
        ],
      };

      const result = await service.create(createDto);

      expect((result.lignes as any[])[0].montantHT).toBe(500); // 5 * 100
    });

    it('should calculate TVA correctly (20% default)', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        ...mockDevisData,
        ...data,
        lignes: data.lignes.create,
      }));

      const createDto = {
        chantierId,
        lignes: [
          {
            description: 'Test',
            quantite: 1,
            unite: 'unité',
            prixUnitaireHT: 100,
          },
        ],
      };

      const result = await service.create(createDto);

      expect((result.lignes as any[])[0].tva).toBe(20);
      expect(result.totalTVA).toBe(20); // 100 * 0.20
      expect(result.totalTTC).toBe(120); // 100 + 20
    });

    it('should calculate with custom TVA rate', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        ...mockDevisData,
        ...data,
        lignes: data.lignes.create,
      }));

      const createDto = {
        chantierId,
        lignes: [
          {
            description: 'Test',
            quantite: 1,
            unite: 'unité',
            prixUnitaireHT: 100,
            tva: 10, // 10% TVA
          },
        ],
      };

      const result = await service.create(createDto);

      expect((result.lignes as any[])[0].tva).toBe(10);
      expect(result.totalTVA).toBe(10); // 100 * 0.10
      expect(result.totalTTC).toBe(110); // 100 + 10
    });

    it('should sum multiple lines correctly', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        ...mockDevisData,
        ...data,
        lignes: data.lignes.create,
      }));

      const createDto = {
        chantierId,
        lignes: [
          { description: 'Line 1', quantite: 2, unite: 'u', prixUnitaireHT: 100 },
          { description: 'Line 2', quantite: 3, unite: 'u', prixUnitaireHT: 50 },
          { description: 'Line 3', quantite: 1, unite: 'u', prixUnitaireHT: 200 },
        ],
      };

      const result = await service.create(createDto);

      // Line 1: 2 * 100 = 200 HT, 40 TVA
      // Line 2: 3 * 50 = 150 HT, 30 TVA
      // Line 3: 1 * 200 = 200 HT, 40 TVA
      // Total: 550 HT, 110 TVA, 660 TTC
      expect(result.totalHT).toBe(550);
      expect(result.totalTVA).toBe(110);
      expect(result.totalTTC).toBe(660);
    });

    it('should handle decimal quantities', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        ...mockDevisData,
        ...data,
        lignes: data.lignes.create,
      }));

      const createDto = {
        chantierId,
        lignes: [
          { description: 'Test', quantite: 2.5, unite: 'm²', prixUnitaireHT: 40 },
        ],
      };

      const result = await service.create(createDto);

      expect(result.totalHT).toBe(100); // 2.5 * 40
      expect(result.totalTVA).toBe(20); // 100 * 0.20
      expect(result.totalTTC).toBe(120);
    });
  });

  describe('Numbering', () => {
    it('should generate numero with format DEV-YYYYMM-XXX', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        ...mockDevisData,
        numero: data.numero,
      }));

      const result = await service.create({
        chantierId,
        lignes: [{ description: 'Test', quantite: 1, unite: 'u', prixUnitaireHT: 100 }],
      });

      expect(result.numero).toMatch(/^DEV-\d{6}-\d{3}$/);
    });

    it('should increment sequence number', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 5 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        ...mockDevisData,
        numero: data.numero,
      }));

      const result = await service.create({
        chantierId,
        lignes: [{ description: 'Test', quantite: 1, unite: 'u', prixUnitaireHT: 100 }],
      });

      expect(result.numero).toContain('-005');
    });
  });

  describe('findAll', () => {
    it('should return paginated devis', async () => {
      mockDevisFindMany.mockResolvedValue([mockDevisData]);
      mockDevisCount.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by chantierId', async () => {
      mockDevisFindMany.mockResolvedValue([]);
      mockDevisCount.mockResolvedValue(0);

      await service.findAll({ chantierId: 'ch-123' });

      expect(mockDevisFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ chantierId: 'ch-123' }),
        }),
      );
    });

    it('should filter by clientId (via chantier)', async () => {
      mockDevisFindMany.mockResolvedValue([]);
      mockDevisCount.mockResolvedValue(0);

      await service.findAll({ clientId: 'client-123' });

      expect(mockDevisFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            chantier: { clientId: 'client-123' },
          }),
        }),
      );
    });

    it('should filter by statut', async () => {
      mockDevisFindMany.mockResolvedValue([]);
      mockDevisCount.mockResolvedValue(0);

      await service.findAll({ statut: 'accepte' });

      expect(mockDevisFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ statut: 'accepte' }),
        }),
      );
    });

    it('should filter by date range', async () => {
      mockDevisFindMany.mockResolvedValue([]);
      mockDevisCount.mockResolvedValue(0);

      await service.findAll({ dateDebut: '2026-01-01', dateFin: '2026-01-31' });

      expect(mockDevisFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            dateEmission: {
              gte: expect.any(Date),
              lte: expect.any(Date),
            },
          }),
        }),
      );
    });

    it('should search by numero', async () => {
      mockDevisFindMany.mockResolvedValue([]);
      mockDevisCount.mockResolvedValue(0);

      await service.findAll({ search: 'DEV-202601' });

      expect(mockDevisFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            numero: { contains: 'DEV-202601', mode: 'insensitive' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return devis with lignes and chantier', async () => {
      const devisWithIncludes = {
        ...mockDevisData,
        chantier: mockChantier,
        lignes: [],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithIncludes);

      const result = await service.findOne('devis-123');

      expect(result).toEqual(devisWithIncludes);
    });

    it('should throw NotFoundException when not found', async () => {
      mockDevisFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create devis with lignes', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        id: 'new-devis',
        ...data,
        lignes: data.lignes.create,
      }));

      const result = await service.create({
        chantierId,
        lignes: [{ description: 'Test', quantite: 1, unite: 'u', prixUnitaireHT: 100 }],
      });

      expect(result.lignes).toHaveLength(1);
      expect(mockDevisCreate).toHaveBeenCalled();
    });

    it('should set validity to 30 days by default', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockSequenceUpsert.mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
      mockDevisCreate.mockImplementation(({ data }) => ({
        id: 'new-devis',
        ...data,
        lignes: [],
      }));

      await service.create({
        chantierId,
        lignes: [{ description: 'Test', quantite: 1, unite: 'u', prixUnitaireHT: 100 }],
      });

      expect(mockDevisCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dateValidite: expect.any(Date),
          }),
        }),
      );
    });

    it('should throw NotFoundException for non-existent chantier', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(
        service.create({
          chantierId: 'non-existent',
          lignes: [{ description: 'Test', quantite: 1, unite: 'u', prixUnitaireHT: 100 }],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update devis in brouillon status', async () => {
      const devisWithIncludes = {
        ...mockDevisData,
        statut: 'brouillon',
        chantier: mockChantier,
        lignes: [],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithIncludes);
      mockDevisUpdate.mockResolvedValue({ ...devisWithIncludes, notes: 'Updated' });

      const result = await service.update('devis-123', { notes: 'Updated' });

      expect(result.notes).toBe('Updated');
    });

    it('should throw BadRequestException when updating non-brouillon devis', async () => {
      const acceptedDevis = {
        ...mockDevisData,
        statut: 'accepte',
        chantier: mockChantier,
        lignes: [],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(acceptedDevis);

      await expect(
        service.update('devis-123', { notes: 'Test' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update('devis-123', { notes: 'Test' }),
      ).rejects.toThrow('Seul un devis en brouillon peut etre modifie');
    });

    it('should recalculate totals when updating lignes', async () => {
      const devisWithIncludes = {
        ...mockDevisData,
        statut: 'brouillon',
        chantier: mockChantier,
        lignes: [],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithIncludes);
      mockLigneDevisDeleteMany.mockResolvedValue({ count: 0 });
      mockDevisUpdate.mockImplementation(({ data }) => ({
        ...devisWithIncludes,
        ...data,
        lignes: data.lignes?.create || [],
      }));

      const result = await service.update('devis-123', {
        lignes: [
          { description: 'New', quantite: 2, unite: 'u', prixUnitaireHT: 200 },
        ],
      });

      expect(mockLigneDevisDeleteMany).toHaveBeenCalledWith({
        where: { devisId: 'devis-123' },
      });
      expect(result.totalHT).toBe(400); // 2 * 200
    });
  });

  describe('updateStatut', () => {
    it('should update statut to envoye', async () => {
      const devisWithIncludes = { ...mockDevisData, chantier: mockChantier, lignes: [], factures: [] };
      mockDevisFindUnique.mockResolvedValue(devisWithIncludes);
      mockDevisUpdate.mockResolvedValue({ ...mockDevisData, statut: 'envoye' });

      const result = await service.updateStatut('devis-123', 'envoye' as any);

      expect(result.statut).toBe('envoye');
    });

    it('should set dateAcceptation when statut is accepte', async () => {
      const devisWithIncludes = { ...mockDevisData, chantier: mockChantier, lignes: [], factures: [] };
      mockDevisFindUnique.mockResolvedValue(devisWithIncludes);
      mockDevisUpdate.mockResolvedValue({
        ...mockDevisData,
        statut: 'accepte',
        dateAcceptation: new Date(),
      });

      await service.updateStatut('devis-123', 'accepte' as any);

      expect(mockDevisUpdate).toHaveBeenCalledWith({
        where: { id: 'devis-123' },
        data: {
          statut: 'accepte',
          dateAcceptation: expect.any(Date),
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete devis without factures', async () => {
      const devisWithIncludes = {
        ...mockDevisData,
        chantier: mockChantier,
        lignes: [],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithIncludes);
      mockDevisDelete.mockResolvedValue(mockDevisData);

      const result = await service.remove('devis-123');

      expect(result).toEqual(mockDevisData);
    });

    it('should throw BadRequestException when devis has factures', async () => {
      const devisWithFactures = {
        ...mockDevisData,
        chantier: mockChantier,
        lignes: [],
        factures: [{ id: 'facture-1' }],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithFactures);

      await expect(service.remove('devis-123')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.remove('devis-123')).rejects.toThrow(
        'Impossible de supprimer un devis avec des factures',
      );
    });
  });
});
