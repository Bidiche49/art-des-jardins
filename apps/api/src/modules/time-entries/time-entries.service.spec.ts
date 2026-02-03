import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { PrismaService } from '../../database/prisma.service';
import {
  createMockIntervention,
  createMockUser,
} from '../../../test/helpers/test-utils';
import { randomUUID } from 'crypto';

describe('TimeEntriesService', () => {
  let service: TimeEntriesService;
  let mockTimeEntryFindMany: jest.Mock;
  let mockTimeEntryFindUnique: jest.Mock;
  let mockTimeEntryCreate: jest.Mock;
  let mockTimeEntryUpdate: jest.Mock;
  let mockTimeEntryDelete: jest.Mock;
  let mockInterventionFindUnique: jest.Mock;
  let mockUserFindUnique: jest.Mock;

  const userId = randomUUID();
  const interventionId = randomUUID();
  const chantierId = randomUUID();
  const mockUser = createMockUser({ id: userId });
  const mockIntervention = createMockIntervention(chantierId, userId, { id: interventionId });

  const createMockTimeEntry = (overrides = {}) => ({
    id: randomUUID(),
    interventionId,
    userId,
    hours: 4.5,
    date: new Date('2026-01-20'),
    description: 'Travail sur le chantier',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    mockTimeEntryFindMany = jest.fn();
    mockTimeEntryFindUnique = jest.fn();
    mockTimeEntryCreate = jest.fn();
    mockTimeEntryUpdate = jest.fn();
    mockTimeEntryDelete = jest.fn();
    mockInterventionFindUnique = jest.fn();
    mockUserFindUnique = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeEntriesService,
        {
          provide: PrismaService,
          useValue: {
            timeEntry: {
              findMany: mockTimeEntryFindMany,
              findUnique: mockTimeEntryFindUnique,
              create: mockTimeEntryCreate,
              update: mockTimeEntryUpdate,
              delete: mockTimeEntryDelete,
            },
            intervention: {
              findUnique: mockInterventionFindUnique,
            },
            user: {
              findUnique: mockUserFindUnique,
            },
          },
        },
      ],
    }).compile();

    service = module.get<TimeEntriesService>(TimeEntriesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      userId,
      hours: 4.5,
      date: '2026-01-20',
      description: 'Travail sur le chantier',
    };

    it('should create a time entry successfully', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);
      mockUserFindUnique.mockResolvedValue(mockUser);
      const createdEntry = createMockTimeEntry({
        user: { id: userId, nom: 'Dupont', prenom: 'Jean' },
        intervention: { id: interventionId, description: 'Tonte pelouse' },
      });
      mockTimeEntryCreate.mockResolvedValue(createdEntry);

      const result = await service.create(interventionId, createDto);

      expect(result).toEqual(createdEntry);
      expect(mockInterventionFindUnique).toHaveBeenCalledWith({
        where: { id: interventionId },
      });
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockTimeEntryCreate).toHaveBeenCalledWith({
        data: {
          interventionId,
          userId,
          hours: 4.5,
          date: expect.any(Date),
          description: 'Travail sur le chantier',
        },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when intervention not found', async () => {
      mockInterventionFindUnique.mockResolvedValue(null);

      await expect(service.create(interventionId, createDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(interventionId, createDto)).rejects.toThrow(
        `Intervention ${interventionId} non trouvee`,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);
      mockUserFindUnique.mockResolvedValue(null);

      await expect(service.create(interventionId, createDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(interventionId, createDto)).rejects.toThrow(
        `Utilisateur ${userId} non trouve`,
      );
    });
  });

  describe('findByIntervention', () => {
    it('should return time entries for an intervention', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);
      const entries = [
        createMockTimeEntry({ user: { id: userId, nom: 'Dupont', prenom: 'Jean' } }),
        createMockTimeEntry({ user: { id: userId, nom: 'Dupont', prenom: 'Jean' } }),
      ];
      mockTimeEntryFindMany.mockResolvedValue(entries);

      const result = await service.findByIntervention(interventionId);

      expect(result).toEqual(entries);
      expect(mockTimeEntryFindMany).toHaveBeenCalledWith({
        where: { interventionId },
        include: {
          user: {
            select: { id: true, nom: true, prenom: true },
          },
        },
        orderBy: { date: 'desc' },
      });
    });

    it('should throw NotFoundException when intervention not found', async () => {
      mockInterventionFindUnique.mockResolvedValue(null);

      await expect(service.findByIntervention(interventionId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a time entry when found', async () => {
      const entry = createMockTimeEntry({
        user: { id: userId, nom: 'Dupont', prenom: 'Jean' },
        intervention: { chantier: { id: chantierId, adresse: '123 Rue Test', ville: 'Angers' } },
      });
      mockTimeEntryFindUnique.mockResolvedValue(entry);

      const result = await service.findOne(entry.id);

      expect(result).toEqual(entry);
    });

    it('should throw NotFoundException when not found', async () => {
      mockTimeEntryFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const entryId = randomUUID();
    const existingEntry = createMockTimeEntry({
      id: entryId,
      user: { id: userId, nom: 'Dupont', prenom: 'Jean' },
      intervention: { chantier: { id: chantierId, adresse: '123 Rue Test', ville: 'Angers' } },
    });

    it('should update a time entry successfully', async () => {
      mockTimeEntryFindUnique.mockResolvedValue(existingEntry);
      const updatedEntry = { ...existingEntry, hours: 6.0 };
      mockTimeEntryUpdate.mockResolvedValue(updatedEntry);

      const result = await service.update(entryId, { hours: 6.0 }) as { hours: number };

      expect(result.hours).toBe(6.0);
      expect(mockTimeEntryUpdate).toHaveBeenCalledWith({
        where: { id: entryId },
        data: { hours: 6.0 },
        include: expect.any(Object),
      });
    });

    it('should update description', async () => {
      mockTimeEntryFindUnique.mockResolvedValue(existingEntry);
      mockTimeEntryUpdate.mockResolvedValue({ ...existingEntry, description: 'Nouvelle description' });

      await service.update(entryId, { description: 'Nouvelle description' });

      expect(mockTimeEntryUpdate).toHaveBeenCalledWith({
        where: { id: entryId },
        data: { description: 'Nouvelle description' },
        include: expect.any(Object),
      });
    });

    it('should update date', async () => {
      mockTimeEntryFindUnique.mockResolvedValue(existingEntry);
      mockTimeEntryUpdate.mockResolvedValue(existingEntry);

      await service.update(entryId, { date: '2026-01-25' });

      expect(mockTimeEntryUpdate).toHaveBeenCalledWith({
        where: { id: entryId },
        data: { date: expect.any(Date) },
        include: expect.any(Object),
      });
    });

    it('should update userId after verifying user exists', async () => {
      const newUserId = randomUUID();
      mockTimeEntryFindUnique.mockResolvedValue(existingEntry);
      mockUserFindUnique.mockResolvedValue(createMockUser({ id: newUserId }));
      mockTimeEntryUpdate.mockResolvedValue({ ...existingEntry, userId: newUserId });

      await service.update(entryId, { userId: newUserId });

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: newUserId },
      });
      expect(mockTimeEntryUpdate).toHaveBeenCalledWith({
        where: { id: entryId },
        data: { userId: newUserId },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when updating with invalid userId', async () => {
      const newUserId = randomUUID();
      mockTimeEntryFindUnique.mockResolvedValue(existingEntry);
      mockUserFindUnique.mockResolvedValue(null);

      await expect(service.update(entryId, { userId: newUserId })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockTimeEntryFindUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', { hours: 5 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a time entry successfully', async () => {
      const entry = createMockTimeEntry({
        user: { id: userId, nom: 'Dupont', prenom: 'Jean' },
        intervention: { chantier: { id: chantierId, adresse: '123 Rue Test', ville: 'Angers' } },
      });
      mockTimeEntryFindUnique.mockResolvedValue(entry);
      mockTimeEntryDelete.mockResolvedValue(entry);

      const result = await service.remove(entry.id);

      expect(result).toEqual(entry);
      expect(mockTimeEntryDelete).toHaveBeenCalledWith({
        where: { id: entry.id },
      });
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockTimeEntryFindUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
