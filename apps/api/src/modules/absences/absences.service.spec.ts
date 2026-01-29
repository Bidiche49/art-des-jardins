import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '@art-et-jardin/database';
import { createMockAbsence, createMockUser } from '../../../test/helpers/test-utils';

describe('AbsencesService', () => {
  let service: AbsencesService;
  let mockAbsenceFindMany: jest.Mock;
  let mockAbsenceFindUnique: jest.Mock;
  let mockAbsenceFindFirst: jest.Mock;
  let mockAbsenceCreate: jest.Mock;
  let mockAbsenceUpdate: jest.Mock;
  let mockAbsenceDelete: jest.Mock;
  let mockAbsenceCount: jest.Mock;

  const userId = 'user-123';
  const patronId = 'patron-123';
  const mockUser = createMockUser({ id: userId });
  const mockAbsence = createMockAbsence(userId, { id: 'absence-123' });

  beforeEach(async () => {
    mockAbsenceFindMany = jest.fn();
    mockAbsenceFindUnique = jest.fn();
    mockAbsenceFindFirst = jest.fn();
    mockAbsenceCreate = jest.fn();
    mockAbsenceUpdate = jest.fn();
    mockAbsenceDelete = jest.fn();
    mockAbsenceCount = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbsencesService,
        {
          provide: PrismaService,
          useValue: {
            absence: {
              findMany: mockAbsenceFindMany,
              findUnique: mockAbsenceFindUnique,
              findFirst: mockAbsenceFindFirst,
              create: mockAbsenceCreate,
              update: mockAbsenceUpdate,
              delete: mockAbsenceDelete,
              count: mockAbsenceCount,
            },
          },
        },
      ],
    }).compile();

    service = module.get<AbsencesService>(AbsencesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated absences', async () => {
      mockAbsenceFindMany.mockResolvedValue([mockAbsence]);
      mockAbsenceCount.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: [mockAbsence],
        meta: {
          total: 1,
          page: 1,
          limit: 50,
          totalPages: 1,
        },
      });
    });

    it('should filter by userId', async () => {
      mockAbsenceFindMany.mockResolvedValue([mockAbsence]);
      mockAbsenceCount.mockResolvedValue(1);

      await service.findAll({ userId });

      expect(mockAbsenceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId }),
        }),
      );
    });

    it('should filter by type', async () => {
      mockAbsenceFindMany.mockResolvedValue([mockAbsence]);
      mockAbsenceCount.mockResolvedValue(1);

      await service.findAll({ type: 'maladie' as any });

      expect(mockAbsenceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'maladie' }),
        }),
      );
    });

    it('should filter by validee', async () => {
      mockAbsenceFindMany.mockResolvedValue([]);
      mockAbsenceCount.mockResolvedValue(0);

      await service.findAll({ validee: true });

      expect(mockAbsenceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ validee: true }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return absence with user when found', async () => {
      const absenceWithUser = { ...mockAbsence, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(absenceWithUser);

      const result = await service.findOne('absence-123');

      expect(result).toEqual(absenceWithUser);
    });

    it('should throw NotFoundException when not found', async () => {
      mockAbsenceFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create absence for self', async () => {
      mockAbsenceFindFirst.mockResolvedValue(null); // No overlap
      const createdAbsence = { ...mockAbsence, user: {} };
      mockAbsenceCreate.mockResolvedValue(createdAbsence);

      const result = await service.create(
        {
          dateDebut: '2026-02-01',
          dateFin: '2026-02-07',
          type: 'conge' as any,
          motif: 'Vacances',
        },
        userId,
        UserRole.employe,
      );

      expect(result).toEqual(createdAbsence);
      expect(mockAbsenceCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId,
            type: 'conge',
            validee: false,
          }),
        }),
      );
    });

    it('should auto-validate when patron creates', async () => {
      mockAbsenceFindFirst.mockResolvedValue(null);
      mockAbsenceCreate.mockResolvedValue({ ...mockAbsence, validee: true, user: {} });

      await service.create(
        {
          dateDebut: '2026-02-01',
          dateFin: '2026-02-07',
          type: 'conge' as any,
        },
        patronId,
        UserRole.patron,
      );

      expect(mockAbsenceCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validee: true,
          }),
        }),
      );
    });

    it('should throw BadRequestException when dates are invalid', async () => {
      await expect(
        service.create(
          {
            dateDebut: '2026-02-07',
            dateFin: '2026-02-01', // End before start
            type: 'conge' as any,
          },
          userId,
          UserRole.employe,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when overlap exists', async () => {
      mockAbsenceFindFirst.mockResolvedValue(mockAbsence); // Overlap found

      await expect(
        service.create(
          {
            dateDebut: '2026-02-01',
            dateFin: '2026-02-07',
            type: 'conge' as any,
          },
          userId,
          UserRole.employe,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException when employee creates for another user', async () => {
      await expect(
        service.create(
          {
            userId: 'other-user',
            dateDebut: '2026-02-01',
            dateFin: '2026-02-07',
            type: 'conge' as any,
          },
          userId,
          UserRole.employe,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow patron to create for another user', async () => {
      mockAbsenceFindFirst.mockResolvedValue(null);
      mockAbsenceCreate.mockResolvedValue({ ...mockAbsence, userId: 'other-user', user: {} });

      await service.create(
        {
          userId: 'other-user',
          dateDebut: '2026-02-01',
          dateFin: '2026-02-07',
          type: 'conge' as any,
        },
        patronId,
        UserRole.patron,
      );

      expect(mockAbsenceCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'other-user',
          }),
        }),
      );
    });
  });

  describe('update', () => {
    it('should update own absence', async () => {
      const absenceWithUser = { ...mockAbsence, validee: false, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(absenceWithUser);
      mockAbsenceUpdate.mockResolvedValue({ ...absenceWithUser, motif: 'Updated' });

      const result = await service.update(
        'absence-123',
        { motif: 'Updated' },
        userId,
        UserRole.employe,
      );

      expect(result.motif).toBe('Updated');
    });

    it('should throw ForbiddenException when employee updates others absence', async () => {
      const otherAbsence = { ...mockAbsence, userId: 'other-user', user: {} };
      mockAbsenceFindUnique.mockResolvedValue(otherAbsence);

      await expect(
        service.update('absence-123', { motif: 'Updated' }, userId, UserRole.employe),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when updating validated absence as employee', async () => {
      const validatedAbsence = { ...mockAbsence, validee: true, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(validatedAbsence);

      await expect(
        service.update('absence-123', { motif: 'Updated' }, userId, UserRole.employe),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow patron to update validated absence', async () => {
      const validatedAbsence = { ...mockAbsence, validee: true, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(validatedAbsence);
      mockAbsenceUpdate.mockResolvedValue({ ...validatedAbsence, motif: 'Updated' });

      const result = await service.update(
        'absence-123',
        { motif: 'Updated' },
        patronId,
        UserRole.patron,
      );

      expect(result.motif).toBe('Updated');
    });
  });

  describe('valider', () => {
    it('should validate absence', async () => {
      const absenceWithUser = { ...mockAbsence, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(absenceWithUser);
      mockAbsenceUpdate.mockResolvedValue({ ...mockAbsence, validee: true, user: mockUser });

      const result = await service.valider('absence-123');

      expect(result.validee).toBe(true);
      expect(mockAbsenceUpdate).toHaveBeenCalledWith({
        where: { id: 'absence-123' },
        data: { validee: true },
        include: expect.any(Object),
      });
    });
  });

  describe('refuser', () => {
    it('should delete absence when refused', async () => {
      const absenceWithUser = { ...mockAbsence, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(absenceWithUser);
      mockAbsenceDelete.mockResolvedValue(mockAbsence);

      const result = await service.refuser('absence-123');

      expect(result.message).toBe('Absence refusee et supprimee');
      expect(mockAbsenceDelete).toHaveBeenCalledWith({
        where: { id: 'absence-123' },
      });
    });
  });

  describe('remove', () => {
    it('should delete own non-validated absence as employee', async () => {
      const absenceWithUser = { ...mockAbsence, validee: false, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(absenceWithUser);
      mockAbsenceDelete.mockResolvedValue(mockAbsence);

      await service.remove('absence-123', userId, UserRole.employe);

      expect(mockAbsenceDelete).toHaveBeenCalledWith({
        where: { id: 'absence-123' },
      });
    });

    it('should throw ForbiddenException when employee deletes others absence', async () => {
      const otherAbsence = { ...mockAbsence, userId: 'other-user', user: {} };
      mockAbsenceFindUnique.mockResolvedValue(otherAbsence);

      await expect(
        service.remove('absence-123', userId, UserRole.employe),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when employee deletes validated absence', async () => {
      const validatedAbsence = { ...mockAbsence, validee: true, user: mockUser };
      mockAbsenceFindUnique.mockResolvedValue(validatedAbsence);

      await expect(
        service.remove('absence-123', userId, UserRole.employe),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow patron to delete any absence', async () => {
      const validatedAbsence = { ...mockAbsence, validee: true, userId: 'other-user', user: {} };
      mockAbsenceFindUnique.mockResolvedValue(validatedAbsence);
      mockAbsenceDelete.mockResolvedValue(validatedAbsence);

      await service.remove('absence-123', patronId, UserRole.patron);

      expect(mockAbsenceDelete).toHaveBeenCalled();
    });
  });

  describe('checkAbsence', () => {
    it('should return absence if user has one on date', async () => {
      mockAbsenceFindFirst.mockResolvedValue(mockAbsence);

      const result = await service.checkAbsence(userId, new Date('2026-02-03'));

      expect(result).toEqual(mockAbsence);
      expect(mockAbsenceFindFirst).toHaveBeenCalledWith({
        where: {
          userId,
          validee: true,
          dateDebut: { lte: expect.any(Date) },
          dateFin: { gte: expect.any(Date) },
        },
      });
    });

    it('should return null if no absence', async () => {
      mockAbsenceFindFirst.mockResolvedValue(null);

      const result = await service.checkAbsence(userId, new Date('2026-02-03'));

      expect(result).toBeNull();
    });
  });

  describe('getAbsencesForPeriod', () => {
    it('should return absences overlapping with period', async () => {
      mockAbsenceFindMany.mockResolvedValue([mockAbsence]);

      const result = await service.getAbsencesForPeriod(
        new Date('2026-02-01'),
        new Date('2026-02-28'),
      );

      expect(result).toEqual([mockAbsence]);
      expect(mockAbsenceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            validee: true,
          }),
        }),
      );
    });
  });
});
