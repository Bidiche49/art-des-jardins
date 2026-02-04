import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { PrismaService } from '../../database/prisma.service';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let mockFindMany: jest.Mock;
  let mockFindUnique: jest.Mock;
  let mockCreate: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockDelete: jest.Mock;
  let mockCount: jest.Mock;

  const mockTemplate = {
    id: 'template-123',
    name: 'Tonte pelouse',
    description: 'Tonte avec ramassage',
    category: 'entretien',
    unit: 'm2',
    unitPriceHT: 0.5,
    tvaRate: 20,
    isGlobal: true,
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTemplates = [
    mockTemplate,
    {
      ...mockTemplate,
      id: 'template-456',
      name: 'Taille haie',
      unit: 'ml',
      unitPriceHT: 5,
    },
  ];

  beforeEach(async () => {
    mockFindMany = jest.fn();
    mockFindUnique = jest.fn();
    mockCreate = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();
    mockCount = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: PrismaService,
          useValue: {
            prestationTemplate: {
              findMany: mockFindMany,
              findUnique: mockFindUnique,
              create: mockCreate,
              update: mockUpdate,
              delete: mockDelete,
              count: mockCount,
            },
          },
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated templates with default pagination', async () => {
      mockFindMany.mockResolvedValue(mockTemplates);
      mockCount.mockResolvedValue(2);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: mockTemplates,
        meta: {
          total: 2,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      });
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });
    });

    it('should apply custom pagination', async () => {
      mockFindMany.mockResolvedValue([mockTemplate]);
      mockCount.mockResolvedValue(25);

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 5,
        totalPages: 5,
      });
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });
    });

    it('should filter by category', async () => {
      mockFindMany.mockResolvedValue([mockTemplate]);
      mockCount.mockResolvedValue(1);

      await service.findAll({ category: 'entretien' });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: 'entretien' },
        }),
      );
    });

    it('should filter by isGlobal', async () => {
      mockFindMany.mockResolvedValue([mockTemplate]);
      mockCount.mockResolvedValue(1);

      await service.findAll({ isGlobal: true });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isGlobal: true },
        }),
      );
    });

    it('should apply search filter on name', async () => {
      mockFindMany.mockResolvedValue([mockTemplate]);
      mockCount.mockResolvedValue(1);

      await service.findAll({ search: 'Tonte' });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: 'Tonte', mode: 'insensitive' } },
        }),
      );
    });

    it('should combine multiple filters', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await service.findAll({
        category: 'entretien',
        search: 'Tonte',
        isGlobal: true,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            category: 'entretien',
            isGlobal: true,
            name: { contains: 'Tonte', mode: 'insensitive' },
          },
        }),
      );
    });

    it('should return empty array when no templates found', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return template when found', async () => {
      mockFindUnique.mockResolvedValue(mockTemplate);

      const result = await service.findOne('template-123');

      expect(result).toEqual(mockTemplate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 'template-123' },
      });
    });

    it('should throw NotFoundException when template not found', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        'Template non-existent non trouve',
      );
    });
  });

  describe('create', () => {
    it('should create a template', async () => {
      const createDto = {
        name: 'Desherbage',
        description: 'Desherbage manuel',
        category: 'entretien',
        unit: 'm2',
        unitPriceHT: 2,
        tvaRate: 20,
        isGlobal: false,
      };
      mockCreate.mockResolvedValue({ id: 'new-id', ...createDto, createdBy: null });

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id');
      expect(mockCreate).toHaveBeenCalledWith({
        data: { ...createDto, createdBy: undefined },
      });
    });

    it('should create a template with userId', async () => {
      const createDto = {
        name: 'Elagage',
        category: 'elagage',
        unit: 'h',
        unitPriceHT: 50,
      };
      mockCreate.mockResolvedValue({
        id: 'new-id',
        ...createDto,
        createdBy: 'user-123',
      });

      const result = await service.create(createDto, 'user-123');

      expect(result.createdBy).toBe('user-123');
      expect(mockCreate).toHaveBeenCalledWith({
        data: { ...createDto, createdBy: 'user-123' },
      });
    });

    it('should create a global template', async () => {
      const createDto = {
        name: 'Plantation arbre',
        category: 'creation',
        unit: 'unite',
        unitPriceHT: 100,
        isGlobal: true,
      };
      mockCreate.mockResolvedValue({ id: 'new-id', ...createDto });

      const result = await service.create(createDto);

      expect(result.isGlobal).toBe(true);
    });
  });

  describe('update', () => {
    it('should update template successfully', async () => {
      mockFindUnique.mockResolvedValue(mockTemplate);
      const updateDto = { name: 'Tonte pelouse standard' };
      mockUpdate.mockResolvedValue({ ...mockTemplate, ...updateDto });

      const result = await service.update('template-123', updateDto);

      expect(result.name).toBe('Tonte pelouse standard');
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'template-123' },
        data: updateDto,
      });
    });

    it('should update partial fields', async () => {
      mockFindUnique.mockResolvedValue(mockTemplate);
      const updateDto = { unitPriceHT: 0.75, description: 'Updated description' };
      mockUpdate.mockResolvedValue({ ...mockTemplate, ...updateDto });

      const result = await service.update('template-123', updateDto);

      expect(result.unitPriceHT).toBe(0.75);
      expect(result.description).toBe('Updated description');
    });

    it('should throw NotFoundException when updating non-existent template', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete template successfully', async () => {
      mockFindUnique.mockResolvedValue(mockTemplate);
      mockDelete.mockResolvedValue(mockTemplate);

      const result = await service.remove('template-123');

      expect(result).toEqual(mockTemplate);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 'template-123' },
      });
    });

    it('should throw NotFoundException when deleting non-existent template', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
