import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InterventionsService } from './interventions.service';
import { PrismaService } from '../../database/prisma.service';
import {
  createMockIntervention,
  createMockChantier,
} from '../../../test/helpers/test-utils';

describe('InterventionsService', () => {
  let service: InterventionsService;
  let mockInterventionFindMany: jest.Mock;
  let mockInterventionFindUnique: jest.Mock;
  let mockInterventionFindFirst: jest.Mock;
  let mockInterventionCreate: jest.Mock;
  let mockInterventionUpdate: jest.Mock;
  let mockInterventionDelete: jest.Mock;
  let mockInterventionCount: jest.Mock;
  let mockChantierFindUnique: jest.Mock;

  const employeId = 'employe-123';
  const chantierId = 'chantier-123';
  const mockChantier = createMockChantier('client-123', { id: chantierId });
  const mockIntervention = createMockIntervention(chantierId, employeId, {
    id: 'intervention-123',
  });

  beforeEach(async () => {
    mockInterventionFindMany = jest.fn();
    mockInterventionFindUnique = jest.fn();
    mockInterventionFindFirst = jest.fn();
    mockInterventionCreate = jest.fn();
    mockInterventionUpdate = jest.fn();
    mockInterventionDelete = jest.fn();
    mockInterventionCount = jest.fn();
    mockChantierFindUnique = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterventionsService,
        {
          provide: PrismaService,
          useValue: {
            intervention: {
              findMany: mockInterventionFindMany,
              findUnique: mockInterventionFindUnique,
              findFirst: mockInterventionFindFirst,
              create: mockInterventionCreate,
              update: mockInterventionUpdate,
              delete: mockInterventionDelete,
              count: mockInterventionCount,
            },
            chantier: {
              findUnique: mockChantierFindUnique,
            },
          },
        },
      ],
    }).compile();

    service = module.get<InterventionsService>(InterventionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated interventions', async () => {
      mockInterventionFindMany.mockResolvedValue([mockIntervention]);
      mockInterventionCount.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: [mockIntervention],
        meta: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      });
    });

    it('should filter by chantierId', async () => {
      mockInterventionFindMany.mockResolvedValue([mockIntervention]);
      mockInterventionCount.mockResolvedValue(1);

      await service.findAll({ chantierId });

      expect(mockInterventionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ chantierId }),
        }),
      );
    });

    it('should filter by employeId', async () => {
      mockInterventionFindMany.mockResolvedValue([mockIntervention]);
      mockInterventionCount.mockResolvedValue(1);

      await service.findAll({ employeId });

      expect(mockInterventionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ employeId }),
        }),
      );
    });

    it('should filter by date range', async () => {
      mockInterventionFindMany.mockResolvedValue([]);
      mockInterventionCount.mockResolvedValue(0);

      await service.findAll({
        dateDebut: '2026-01-01',
        dateFin: '2026-01-31',
      });

      expect(mockInterventionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: expect.any(Date),
              lte: expect.any(Date),
            },
          }),
        }),
      );
    });

    it('should filter by valide', async () => {
      mockInterventionFindMany.mockResolvedValue([]);
      mockInterventionCount.mockResolvedValue(0);

      await service.findAll({ valide: true });

      expect(mockInterventionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ valide: true }),
        }),
      );
    });

    it('should filter by enCours', async () => {
      mockInterventionFindMany.mockResolvedValue([]);
      mockInterventionCount.mockResolvedValue(0);

      await service.findAll({ enCours: true });

      expect(mockInterventionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ heureFin: null }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return intervention with includes when found', async () => {
      const interventionWithIncludes = {
        ...mockIntervention,
        chantier: { ...mockChantier, client: {} },
        employe: {},
      };
      mockInterventionFindUnique.mockResolvedValue(interventionWithIncludes);

      const result = await service.findOne('intervention-123');

      expect(result).toEqual(interventionWithIncludes);
    });

    it('should throw NotFoundException when not found', async () => {
      mockInterventionFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('startIntervention', () => {
    it('should start intervention successfully', async () => {
      mockInterventionFindFirst.mockResolvedValue(null); // No ongoing intervention
      const createdIntervention = {
        ...mockIntervention,
        heureFin: null,
        chantier: {},
      };
      mockInterventionCreate.mockResolvedValue(createdIntervention);

      const result = await service.startIntervention(chantierId, employeId);

      expect(result.heureFin).toBeNull();
      expect(mockInterventionCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          chantierId,
          employeId,
          date: expect.any(Date),
          heureDebut: expect.any(Date),
        }),
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException when already has ongoing intervention', async () => {
      mockInterventionFindFirst.mockResolvedValue(mockIntervention);

      await expect(
        service.startIntervention(chantierId, employeId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.startIntervention(chantierId, employeId),
      ).rejects.toThrow('Vous avez deja une intervention en cours');
    });

    it('should start with description', async () => {
      mockInterventionFindFirst.mockResolvedValue(null);
      mockInterventionCreate.mockResolvedValue({ ...mockIntervention, chantier: {} });

      await service.startIntervention(chantierId, employeId, 'Test description');

      expect(mockInterventionCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          description: 'Test description',
        }),
        include: expect.any(Object),
      });
    });
  });

  describe('stopIntervention', () => {
    it('should stop intervention and calculate duration', async () => {
      const ongoingIntervention = {
        ...mockIntervention,
        heureFin: null,
        heureDebut: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        chantier: { client: {} },
        employe: {},
      };
      mockInterventionFindUnique.mockResolvedValue(ongoingIntervention);
      mockInterventionUpdate.mockResolvedValue({
        ...ongoingIntervention,
        heureFin: new Date(),
        dureeMinutes: 60,
        chantier: {},
      });

      const result = await service.stopIntervention('intervention-123', employeId);

      expect(result.heureFin).toBeDefined();
      expect(mockInterventionUpdate).toHaveBeenCalledWith({
        where: { id: 'intervention-123' },
        data: {
          heureFin: expect.any(Date),
          dureeMinutes: expect.any(Number),
        },
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException when stopping other employee intervention', async () => {
      const otherEmployeIntervention = {
        ...mockIntervention,
        employeId: 'other-employe',
        heureFin: null,
        chantier: { client: {} },
        employe: {},
      };
      mockInterventionFindUnique.mockResolvedValue(otherEmployeIntervention);

      await expect(
        service.stopIntervention('intervention-123', employeId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.stopIntervention('intervention-123', employeId),
      ).rejects.toThrow('Vous ne pouvez arreter que vos propres interventions');
    });

    it('should throw BadRequestException when already stopped', async () => {
      const stoppedIntervention = {
        ...mockIntervention,
        heureFin: new Date(),
        chantier: { client: {} },
        employe: {},
      };
      mockInterventionFindUnique.mockResolvedValue(stoppedIntervention);

      await expect(
        service.stopIntervention('intervention-123', employeId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.stopIntervention('intervention-123', employeId),
      ).rejects.toThrow('Cette intervention est deja terminee');
    });
  });

  describe('getInterventionEnCours', () => {
    it('should return ongoing intervention', async () => {
      const ongoingIntervention = { ...mockIntervention, heureFin: null, chantier: {} };
      mockInterventionFindFirst.mockResolvedValue(ongoingIntervention);

      const result = await service.getInterventionEnCours(employeId);

      expect(result).toEqual(ongoingIntervention);
      expect(mockInterventionFindFirst).toHaveBeenCalledWith({
        where: {
          employeId,
          heureFin: null,
        },
        include: expect.any(Object),
      });
    });

    it('should return null when no ongoing intervention', async () => {
      mockInterventionFindFirst.mockResolvedValue(null);

      const result = await service.getInterventionEnCours(employeId);

      expect(result).toBeNull();
    });
  });

  describe('valider', () => {
    it('should validate intervention successfully', async () => {
      const interventionWithIncludes = { ...mockIntervention, chantier: { client: {} }, employe: {} };
      mockInterventionFindUnique.mockResolvedValue(interventionWithIncludes);
      mockInterventionUpdate.mockResolvedValue({
        ...mockIntervention,
        valide: true,
      });

      const result = await service.valider('intervention-123');

      expect(result.valide).toBe(true);
      expect(mockInterventionUpdate).toHaveBeenCalledWith({
        where: { id: 'intervention-123' },
        data: { valide: true },
      });
    });
  });

  describe('duration calculation', () => {
    it('should calculate 60 minutes for 1 hour', async () => {
      const heureDebut = new Date('2026-01-25T08:00:00');
      const ongoingIntervention = {
        ...mockIntervention,
        heureDebut,
        heureFin: null,
        chantier: { client: {} },
        employe: {},
      };
      mockInterventionFindUnique.mockResolvedValue(ongoingIntervention);

      // Mock Date.now to return 1 hour later
      const heureFin = new Date('2026-01-25T09:00:00');
      jest.spyOn(global, 'Date').mockImplementation((arg) => {
        if (arg === undefined) return heureFin;
        return new (jest.requireActual('Date'))(arg);
      });

      mockInterventionUpdate.mockResolvedValue({
        ...ongoingIntervention,
        heureFin,
        dureeMinutes: 60,
        chantier: {},
      });

      await service.stopIntervention('intervention-123', employeId);

      expect(mockInterventionUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dureeMinutes: 60,
          }),
        }),
      );

      jest.restoreAllMocks();
    });
  });

  describe('remove', () => {
    it('should delete intervention successfully', async () => {
      const interventionWithIncludes = { ...mockIntervention, chantier: { client: {} }, employe: {} };
      mockInterventionFindUnique.mockResolvedValue(interventionWithIncludes);
      mockInterventionDelete.mockResolvedValue(mockIntervention);

      const result = await service.remove('intervention-123');

      expect(result).toEqual(mockIntervention);
    });

    it('should throw NotFoundException when not found', async () => {
      mockInterventionFindUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
