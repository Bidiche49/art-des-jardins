import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { PrismaService } from '../../database/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import {
  createMockFacture,
  createMockDevis,
  createMockLigneDevis,
} from '../../../test/helpers/test-utils';

describe('FacturesService', () => {
  let service: FacturesService;
  let mockFactureFindMany: jest.Mock;
  let mockFactureFindUnique: jest.Mock;
  let mockFactureCreate: jest.Mock;
  let mockFactureUpdate: jest.Mock;
  let mockFactureDelete: jest.Mock;
  let mockFactureCount: jest.Mock;
  let mockDevisFindUnique: jest.Mock;
  let mockSequenceUpsert: jest.Mock;
  let mockBroadcast: jest.Mock;

  const devisId = 'devis-123';
  const mockDevisData = createMockDevis('chantier-123', {
    id: devisId,
    statut: 'accepte',
    totalHT: 1000,
    totalTVA: 200,
    totalTTC: 1200,
  });
  const mockFactureData = createMockFacture(devisId, {
    id: 'facture-123',
    statut: 'brouillon',
  });
  const mockLigne = createMockLigneDevis(devisId);

  beforeEach(async () => {
    mockFactureFindMany = jest.fn();
    mockFactureFindUnique = jest.fn();
    mockFactureCreate = jest.fn();
    mockFactureUpdate = jest.fn();
    mockFactureDelete = jest.fn();
    mockFactureCount = jest.fn();
    mockDevisFindUnique = jest.fn();
    mockSequenceUpsert = jest.fn();
    mockBroadcast = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturesService,
        {
          provide: PrismaService,
          useValue: {
            facture: {
              findMany: mockFactureFindMany,
              findUnique: mockFactureFindUnique,
              create: mockFactureCreate,
              update: mockFactureUpdate,
              delete: mockFactureDelete,
              count: mockFactureCount,
            },
            devis: {
              findUnique: mockDevisFindUnique,
            },
            sequence: {
              upsert: mockSequenceUpsert,
            },
          },
        },
        {
          provide: EventsGateway,
          useValue: {
            broadcast: mockBroadcast,
            sendToUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FacturesService>(FacturesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFromDevis', () => {
    it('should create facture from accepted devis', async () => {
      const devisWithLignes = {
        ...mockDevisData,
        statut: 'accepte',
        lignes: [mockLigne],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithLignes);
      mockSequenceUpsert.mockResolvedValue({ id: 'FAC-202601', lastValue: 1 });
      mockFactureCreate.mockImplementation(({ data }) => ({
        id: 'new-facture',
        ...data,
        lignes: data.lignes.create,
        devis: { chantier: { client: { nom: 'Test Client' } } },
      }));

      const result = await service.createFromDevis(devisId);

      expect(result).toHaveProperty('numero');
      expect(result.numero).toMatch(/^FAC-\d{6}-\d{3}$/);
      expect(result.totalHT).toBe(devisWithLignes.totalHT);
      expect(result.totalTVA).toBe(devisWithLignes.totalTVA);
      expect(result.totalTTC).toBe(devisWithLignes.totalTTC);
    });

    it('should copy lignes from devis', async () => {
      const devisWithLignes = {
        ...mockDevisData,
        statut: 'accepte',
        lignes: [mockLigne, { ...mockLigne, id: 'ligne-2', description: 'Line 2' }],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithLignes);
      mockSequenceUpsert.mockResolvedValue({ id: 'FAC-202601', lastValue: 1 });
      mockFactureCreate.mockImplementation(({ data }) => ({
        id: 'new-facture',
        ...data,
        lignes: data.lignes.create,
        devis: { chantier: { client: { nom: 'Test Client' } } },
      }));

      const result = await service.createFromDevis(devisId);

      expect(result.lignes).toHaveLength(2);
    });

    it('should throw BadRequestException when devis is brouillon', async () => {
      const devisBrouillon = {
        ...mockDevisData,
        statut: 'brouillon',
        lignes: [],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisBrouillon);

      await expect(service.createFromDevis(devisId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createFromDevis(devisId)).rejects.toThrow(
        'Seul un devis accepte peut etre facture',
      );
    });

    it('should throw BadRequestException when devis is refused', async () => {
      const devisRefuse = {
        ...mockDevisData,
        statut: 'refuse',
        lignes: [],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisRefuse);

      await expect(service.createFromDevis(devisId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when devis already has facture', async () => {
      const devisWithFacture = {
        ...mockDevisData,
        statut: 'accepte',
        lignes: [],
        factures: [{ id: 'existing-facture' }],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithFacture);

      await expect(service.createFromDevis(devisId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createFromDevis(devisId)).rejects.toThrow(
        'Ce devis a deja une facture',
      );
    });

    it('should throw NotFoundException when devis not found', async () => {
      mockDevisFindUnique.mockResolvedValue(null);

      await expect(service.createFromDevis('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should set default 30 days payment delay', async () => {
      const devisWithLignes = {
        ...mockDevisData,
        statut: 'accepte',
        lignes: [mockLigne],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithLignes);
      mockSequenceUpsert.mockResolvedValue({ id: 'FAC-202601', lastValue: 1 });
      mockFactureCreate.mockImplementation(({ data }) => ({
        id: 'new-facture',
        ...data,
        lignes: data.lignes.create,
        devis: { chantier: { client: { nom: 'Test Client' } } },
      }));

      await service.createFromDevis(devisId);

      expect(mockFactureCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dateEcheance: expect.any(Date),
          }),
        }),
      );
    });

    it('should use custom payment delay', async () => {
      const devisWithLignes = {
        ...mockDevisData,
        statut: 'accepte',
        lignes: [mockLigne],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithLignes);
      mockSequenceUpsert.mockResolvedValue({ id: 'FAC-202601', lastValue: 1 });
      mockFactureCreate.mockImplementation(({ data }) => ({
        id: 'new-facture',
        ...data,
        devis: { chantier: { client: { nom: 'Test Client' } } },
      }));

      await service.createFromDevis(devisId, { delaiPaiement: 45 });

      // Verify dateEcheance is set
      expect(mockFactureCreate).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated factures', async () => {
      mockFactureFindMany.mockResolvedValue([mockFactureData]);
      mockFactureCount.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by devisId', async () => {
      mockFactureFindMany.mockResolvedValue([]);
      mockFactureCount.mockResolvedValue(0);

      await service.findAll({ devisId: 'devis-123' });

      expect(mockFactureFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ devisId: 'devis-123' }),
        }),
      );
    });

    it('should filter by clientId (via devis.chantier)', async () => {
      mockFactureFindMany.mockResolvedValue([]);
      mockFactureCount.mockResolvedValue(0);

      await service.findAll({ clientId: 'client-123' });

      expect(mockFactureFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            devis: { chantier: { clientId: 'client-123' } },
          }),
        }),
      );
    });

    it('should filter by statut', async () => {
      mockFactureFindMany.mockResolvedValue([]);
      mockFactureCount.mockResolvedValue(0);

      await service.findAll({ statut: 'payee' });

      expect(mockFactureFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ statut: 'payee' }),
        }),
      );
    });

    it('should filter enRetard (overdue)', async () => {
      mockFactureFindMany.mockResolvedValue([]);
      mockFactureCount.mockResolvedValue(0);

      await service.findAll({ enRetard: true });

      expect(mockFactureFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            dateEcheance: { lt: expect.any(Date) },
            statut: { notIn: ['payee', 'annulee'] },
          }),
        }),
      );
    });

    it('should filter by date range', async () => {
      mockFactureFindMany.mockResolvedValue([]);
      mockFactureCount.mockResolvedValue(0);

      await service.findAll({ dateDebut: '2026-01-01', dateFin: '2026-01-31' });

      expect(mockFactureFindMany).toHaveBeenCalledWith(
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
      mockFactureFindMany.mockResolvedValue([]);
      mockFactureCount.mockResolvedValue(0);

      await service.findAll({ search: 'FAC-202601' });

      expect(mockFactureFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            numero: { contains: 'FAC-202601', mode: 'insensitive' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return facture with lignes and devis', async () => {
      const factureWithIncludes = {
        ...mockFactureData,
        devis: mockDevisData,
        lignes: [],
      };
      mockFactureFindUnique.mockResolvedValue(factureWithIncludes);

      const result = await service.findOne('facture-123');

      expect(result).toEqual(factureWithIncludes);
    });

    it('should throw NotFoundException when not found', async () => {
      mockFactureFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('marquerPayee', () => {
    it('should mark facture as paid', async () => {
      mockFactureUpdate.mockResolvedValue({
        ...mockFactureData,
        id: 'facture-123',
        numero: 'FAC-202601-001',
        totalTTC: 1200,
        statut: 'payee',
        datePaiement: new Date(),
        modePaiement: 'virement',
        devis: { chantier: { client: { nom: 'Test Client' } } },
      });

      const result = await service.marquerPayee('facture-123', 'virement');

      expect(result.statut).toBe('payee');
      expect(result.modePaiement).toBe('virement');
      expect(mockFactureUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'facture-123' },
          data: {
            statut: 'payee',
            datePaiement: expect.any(Date),
            modePaiement: 'virement',
            referencePaiement: undefined,
          },
        }),
      );
    });

    it('should set payment reference when provided', async () => {
      mockFactureUpdate.mockResolvedValue({
        ...mockFactureData,
        statut: 'payee',
        referencePaiement: 'REF-123',
        devis: { chantier: { client: { nom: 'Test Client' } } },
      });

      await service.marquerPayee('facture-123', 'virement', 'REF-123');

      expect(mockFactureUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            referencePaiement: 'REF-123',
          }),
        }),
      );
    });

    it('should set datePaiement to now', async () => {
      mockFactureUpdate.mockResolvedValue({
        ...mockFactureData,
        datePaiement: new Date(),
        devis: { chantier: { client: { nom: 'Test Client' } } },
      });

      await service.marquerPayee('facture-123', 'cheque');

      expect(mockFactureUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            datePaiement: expect.any(Date),
          }),
        }),
      );
    });

    it('should emit WebSocket event when facture is marked as paid', async () => {
      mockFactureUpdate.mockResolvedValue({
        ...mockFactureData,
        id: 'facture-123',
        numero: 'FAC-202601-001',
        totalTTC: 1200,
        statut: 'payee',
        datePaiement: new Date(),
        modePaiement: 'virement',
        devis: { chantier: { client: { nom: 'Test Client' } } },
      });

      await service.marquerPayee('facture-123', 'virement');

      expect(mockBroadcast).toHaveBeenCalledWith('facture:paid', {
        id: 'facture-123',
        numero: 'FAC-202601-001',
        clientName: 'Test Client',
        amount: 1200,
      });
    });
  });

  describe('remove', () => {
    it('should delete brouillon facture', async () => {
      const factureWithIncludes = {
        ...mockFactureData,
        statut: 'brouillon',
        devis: mockDevisData,
        lignes: [],
      };
      mockFactureFindUnique.mockResolvedValue(factureWithIncludes);
      mockFactureDelete.mockResolvedValue(mockFactureData);

      const result = await service.remove('facture-123');

      expect(result).toEqual(mockFactureData);
    });

    it('should throw BadRequestException when deleting paid facture', async () => {
      const paidFacture = {
        ...mockFactureData,
        statut: 'payee',
        devis: mockDevisData,
        lignes: [],
      };
      mockFactureFindUnique.mockResolvedValue(paidFacture);

      await expect(service.remove('facture-123')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.remove('facture-123')).rejects.toThrow(
        'Impossible de supprimer une facture payee',
      );
    });
  });

  describe('Numbering', () => {
    it('should generate numero with format FAC-YYYYMM-XXX', async () => {
      const devisWithLignes = {
        ...mockDevisData,
        statut: 'accepte',
        lignes: [mockLigne],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithLignes);
      mockSequenceUpsert.mockResolvedValue({ id: 'FAC-202601', lastValue: 1 });
      mockFactureCreate.mockImplementation(({ data }) => ({
        id: 'new-facture',
        numero: data.numero,
        devis: { chantier: { client: { nom: 'Test Client' } } },
      }));

      const result = await service.createFromDevis(devisId);

      expect(result.numero).toMatch(/^FAC-\d{6}-001$/);
    });

    it('should increment separate from devis sequence', async () => {
      const devisWithLignes = {
        ...mockDevisData,
        statut: 'accepte',
        lignes: [mockLigne],
        factures: [],
      };
      mockDevisFindUnique.mockResolvedValue(devisWithLignes);
      mockSequenceUpsert.mockResolvedValue({ id: 'FAC-202601', lastValue: 10 });
      mockFactureCreate.mockImplementation(({ data }) => ({
        id: 'new-facture',
        numero: data.numero,
        devis: { chantier: { client: { nom: 'Test Client' } } },
      }));

      const result = await service.createFromDevis(devisId);

      expect(result.numero).toContain('-010');
    });
  });
});
