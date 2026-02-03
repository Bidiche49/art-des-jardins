import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MaterialUsagesService } from './material-usages.service';
import { PrismaService } from '../../database/prisma.service';
import { createMockChantier } from '../../../test/helpers/test-utils';

describe('MaterialUsagesService', () => {
  let service: MaterialUsagesService;
  let mockMaterialUsageFindMany: jest.Mock;
  let mockMaterialUsageFindUnique: jest.Mock;
  let mockMaterialUsageCreate: jest.Mock;
  let mockMaterialUsageUpdate: jest.Mock;
  let mockMaterialUsageDelete: jest.Mock;
  let mockChantierFindUnique: jest.Mock;

  const chantierId = 'chantier-123';
  const mockChantier = createMockChantier('client-123', { id: chantierId });

  const createMockMaterialUsage = (overrides = {}) => ({
    id: 'material-123',
    chantierId,
    name: 'Gravier',
    quantity: 10,
    unitCost: 15,
    totalCost: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    mockMaterialUsageFindMany = jest.fn();
    mockMaterialUsageFindUnique = jest.fn();
    mockMaterialUsageCreate = jest.fn();
    mockMaterialUsageUpdate = jest.fn();
    mockMaterialUsageDelete = jest.fn();
    mockChantierFindUnique = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialUsagesService,
        {
          provide: PrismaService,
          useValue: {
            materialUsage: {
              findMany: mockMaterialUsageFindMany,
              findUnique: mockMaterialUsageFindUnique,
              create: mockMaterialUsageCreate,
              update: mockMaterialUsageUpdate,
              delete: mockMaterialUsageDelete,
            },
            chantier: {
              findUnique: mockChantierFindUnique,
            },
          },
        },
      ],
    }).compile();

    service = module.get<MaterialUsagesService>(MaterialUsagesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create material with calculated totalCost', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      const expectedMaterial = createMockMaterialUsage({
        chantier: { id: chantierId, adresse: mockChantier.adresse, ville: mockChantier.ville },
      });
      mockMaterialUsageCreate.mockResolvedValue(expectedMaterial);

      const result = await service.create(chantierId, {
        name: 'Gravier',
        quantity: 10,
        unitCost: 15,
      });

      expect(result).toEqual(expectedMaterial);
      expect(mockMaterialUsageCreate).toHaveBeenCalledWith({
        data: {
          chantierId,
          name: 'Gravier',
          quantity: 10,
          unitCost: 15,
          totalCost: 150,
        },
        include: {
          chantier: {
            select: { id: true, adresse: true, ville: true },
          },
        },
      });
    });

    it('should throw NotFoundException when chantier not found', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(
        service.create('non-existent', { name: 'Gravier', quantity: 10, unitCost: 15 }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.create('non-existent', { name: 'Gravier', quantity: 10, unitCost: 15 }),
      ).rejects.toThrow('Chantier non-existent non trouve');
    });

    it('should calculate totalCost correctly for decimal quantities', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockMaterialUsageCreate.mockResolvedValue(createMockMaterialUsage());

      await service.create(chantierId, {
        name: 'Sable',
        quantity: 2.5,
        unitCost: 12.50,
      });

      const createCall = mockMaterialUsageCreate.mock.calls[0][0];
      expect(createCall.data.totalCost).toBe(31.25); // 2.5 * 12.50 = 31.25
    });
  });

  describe('findByChantier', () => {
    it('should return materials for chantier', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      const materials = [createMockMaterialUsage(), createMockMaterialUsage({ id: 'material-456' })];
      mockMaterialUsageFindMany.mockResolvedValue(materials);

      const result = await service.findByChantier(chantierId);

      expect(result).toEqual(materials);
      expect(mockMaterialUsageFindMany).toHaveBeenCalledWith({
        where: { chantierId },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should throw NotFoundException when chantier not found', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(service.findByChantier('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should return empty array when no materials', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);
      mockMaterialUsageFindMany.mockResolvedValue([]);

      const result = await service.findByChantier(chantierId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return material with chantier include', async () => {
      const materialWithChantier = createMockMaterialUsage({
        chantier: { id: chantierId, adresse: mockChantier.adresse, ville: mockChantier.ville },
      });
      mockMaterialUsageFindUnique.mockResolvedValue(materialWithChantier);

      const result = await service.findOne('material-123');

      expect(result).toEqual(materialWithChantier);
      expect(mockMaterialUsageFindUnique).toHaveBeenCalledWith({
        where: { id: 'material-123' },
        include: {
          chantier: {
            select: { id: true, adresse: true, ville: true },
          },
        },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockMaterialUsageFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('non-existent')).rejects.toThrow('Materiau non-existent non trouve');
    });
  });

  describe('update', () => {
    it('should update material and recalculate totalCost when quantity changes', async () => {
      const existingMaterial = createMockMaterialUsage({
        chantier: { id: chantierId, adresse: mockChantier.adresse, ville: mockChantier.ville },
      });
      mockMaterialUsageFindUnique.mockResolvedValue(existingMaterial);
      mockMaterialUsageUpdate.mockResolvedValue({
        ...existingMaterial,
        quantity: 20,
        totalCost: 300,
      });

      await service.update('material-123', { quantity: 20 });

      const updateCall = mockMaterialUsageUpdate.mock.calls[0][0];
      expect(updateCall.data.totalCost).toBe(300); // 20 * 15 = 300
    });

    it('should update material and recalculate totalCost when unitCost changes', async () => {
      const existingMaterial = createMockMaterialUsage({
        chantier: { id: chantierId, adresse: mockChantier.adresse, ville: mockChantier.ville },
      });
      mockMaterialUsageFindUnique.mockResolvedValue(existingMaterial);
      mockMaterialUsageUpdate.mockResolvedValue({
        ...existingMaterial,
        unitCost: 25,
        totalCost: 250,
      });

      await service.update('material-123', { unitCost: 25 });

      const updateCall = mockMaterialUsageUpdate.mock.calls[0][0];
      expect(updateCall.data.totalCost).toBe(250); // 10 * 25 = 250
    });

    it('should update material and recalculate totalCost when both change', async () => {
      const existingMaterial = createMockMaterialUsage({
        chantier: { id: chantierId, adresse: mockChantier.adresse, ville: mockChantier.ville },
      });
      mockMaterialUsageFindUnique.mockResolvedValue(existingMaterial);
      mockMaterialUsageUpdate.mockResolvedValue({
        ...existingMaterial,
        quantity: 5,
        unitCost: 30,
        totalCost: 150,
      });

      await service.update('material-123', { quantity: 5, unitCost: 30 });

      const updateCall = mockMaterialUsageUpdate.mock.calls[0][0];
      expect(updateCall.data.totalCost).toBe(150); // 5 * 30 = 150
    });

    it('should update name without recalculating totalCost', async () => {
      const existingMaterial = createMockMaterialUsage({
        chantier: { id: chantierId, adresse: mockChantier.adresse, ville: mockChantier.ville },
      });
      mockMaterialUsageFindUnique.mockResolvedValue(existingMaterial);
      mockMaterialUsageUpdate.mockResolvedValue({
        ...existingMaterial,
        name: 'Sable fin',
      });

      await service.update('material-123', { name: 'Sable fin' });

      const updateCall = mockMaterialUsageUpdate.mock.calls[0][0];
      expect(updateCall.data.name).toBe('Sable fin');
      expect(updateCall.data.totalCost).toBeUndefined();
    });

    it('should throw NotFoundException when material not found', async () => {
      mockMaterialUsageFindUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete material successfully', async () => {
      const material = createMockMaterialUsage({
        chantier: { id: chantierId, adresse: mockChantier.adresse, ville: mockChantier.ville },
      });
      mockMaterialUsageFindUnique.mockResolvedValue(material);
      mockMaterialUsageDelete.mockResolvedValue(material);

      const result = await service.remove('material-123');

      expect(result).toEqual(material);
      expect(mockMaterialUsageDelete).toHaveBeenCalledWith({
        where: { id: 'material-123' },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockMaterialUsageFindUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('totalCost invariant', () => {
    it('should always have totalCost = quantity * unitCost on create', async () => {
      mockChantierFindUnique.mockResolvedValue(mockChantier);

      const testCases = [
        { quantity: 1, unitCost: 100, expected: 100 },
        { quantity: 0.5, unitCost: 20, expected: 10 },
        { quantity: 100, unitCost: 0.01, expected: 1 },
        { quantity: 3.33, unitCost: 3, expected: 9.99 },
      ];

      for (const testCase of testCases) {
        mockMaterialUsageCreate.mockResolvedValue(createMockMaterialUsage());
        await service.create(chantierId, {
          name: 'Test',
          quantity: testCase.quantity,
          unitCost: testCase.unitCost,
        });

        const createCall = mockMaterialUsageCreate.mock.calls[mockMaterialUsageCreate.mock.calls.length - 1][0];
        expect(createCall.data.totalCost).toBeCloseTo(testCase.expected, 2);
      }
    });
  });
});
