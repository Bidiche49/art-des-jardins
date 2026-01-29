import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChantiersService } from './chantiers.service';
import { PrismaService } from '../../database/prisma.service';
import {
  createMockChantier,
  createMockClient,
  createMockUser,
} from '../../../test/helpers/test-utils';

describe('ChantiersService', () => {
  let service: ChantiersService;
  let mockChantierFindMany: jest.Mock;
  let mockChantierFindUnique: jest.Mock;
  let mockChantierCreate: jest.Mock;
  let mockChantierUpdate: jest.Mock;
  let mockChantierDelete: jest.Mock;
  let mockChantierCount: jest.Mock;

  const mockClient = createMockClient({ id: 'client-123' });
  const mockUser = createMockUser({ id: 'user-123' });
  const mockChantier = createMockChantier('client-123', {
    id: 'chantier-123',
    responsableId: 'user-123',
  });
  const mockChantiers = [mockChantier];

  beforeEach(async () => {
    mockChantierFindMany = jest.fn();
    mockChantierFindUnique = jest.fn();
    mockChantierCreate = jest.fn();
    mockChantierUpdate = jest.fn();
    mockChantierDelete = jest.fn();
    mockChantierCount = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChantiersService,
        {
          provide: PrismaService,
          useValue: {
            chantier: {
              findMany: mockChantierFindMany,
              findUnique: mockChantierFindUnique,
              create: mockChantierCreate,
              update: mockChantierUpdate,
              delete: mockChantierDelete,
              count: mockChantierCount,
            },
          },
        },
      ],
    }).compile();

    service = module.get<ChantiersService>(ChantiersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated chantiers with default pagination', async () => {
      mockChantierFindMany.mockResolvedValue(mockChantiers);
      mockChantierCount.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: mockChantiers,
        meta: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      });
    });

    it('should filter by clientId', async () => {
      mockChantierFindMany.mockResolvedValue(mockChantiers);
      mockChantierCount.mockResolvedValue(1);

      await service.findAll({ clientId: 'client-123' });

      expect(mockChantierFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ clientId: 'client-123' }),
        }),
      );
    });

    it('should filter by statut', async () => {
      mockChantierFindMany.mockResolvedValue(mockChantiers);
      mockChantierCount.mockResolvedValue(1);

      await service.findAll({ statut: 'en_cours' });

      expect(mockChantierFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ statut: 'en_cours' }),
        }),
      );
    });

    it('should filter by responsableId', async () => {
      mockChantierFindMany.mockResolvedValue(mockChantiers);
      mockChantierCount.mockResolvedValue(1);

      await service.findAll({ responsableId: 'user-123' });

      expect(mockChantierFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ responsableId: 'user-123' }),
        }),
      );
    });

    it('should filter by ville', async () => {
      mockChantierFindMany.mockResolvedValue(mockChantiers);
      mockChantierCount.mockResolvedValue(1);

      await service.findAll({ ville: 'Angers' });

      expect(mockChantierFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            ville: { contains: 'Angers', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should apply full-text search', async () => {
      mockChantierFindMany.mockResolvedValue([]);
      mockChantierCount.mockResolvedValue(0);

      await service.findAll({ search: 'jardin' });

      expect(mockChantierFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { adresse: { contains: 'jardin', mode: 'insensitive' } },
              { description: { contains: 'jardin', mode: 'insensitive' } },
              { ville: { contains: 'jardin', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });

    it('should combine multiple filters', async () => {
      mockChantierFindMany.mockResolvedValue([]);
      mockChantierCount.mockResolvedValue(0);

      await service.findAll({
        clientId: 'client-123',
        statut: 'lead',
        ville: 'Angers',
      });

      expect(mockChantierFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            clientId: 'client-123',
            statut: 'lead',
            ville: { contains: 'Angers', mode: 'insensitive' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return chantier with all includes when found', async () => {
      const chantierWithIncludes = {
        ...mockChantier,
        client: mockClient,
        responsable: mockUser,
        devis: [],
        interventions: [],
      };
      mockChantierFindUnique.mockResolvedValue(chantierWithIncludes);

      const result = await service.findOne('chantier-123');

      expect(result).toEqual(chantierWithIncludes);
      expect(mockChantierFindUnique).toHaveBeenCalledWith({
        where: { id: 'chantier-123' },
        include: expect.objectContaining({
          client: true,
          responsable: expect.any(Object),
          devis: expect.any(Object),
          interventions: expect.any(Object),
        }),
      });
    });

    it('should throw NotFoundException when chantier not found', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        'Chantier non-existent non trouve',
      );
    });
  });

  describe('create', () => {
    it('should create chantier with client', async () => {
      const createDto = {
        clientId: 'client-123',
        adresse: '123 Rue Test',
        codePostal: '49000',
        ville: 'Angers',
        typePrestation: ['paysagisme'],
        description: 'Test description',
      };
      const createdChantier = {
        id: 'new-chantier',
        ...createDto,
        client: mockClient,
      };
      mockChantierCreate.mockResolvedValue(createdChantier);

      const result = await service.create(createDto as any);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('client');
      expect(mockChantierCreate).toHaveBeenCalledWith({
        data: createDto,
        include: expect.any(Object),
      });
    });

    it('should create chantier with GPS coordinates', async () => {
      const createDto = {
        clientId: 'client-123',
        adresse: '123 Rue Test',
        codePostal: '49000',
        ville: 'Angers',
        typePrestation: ['paysagisme'],
        description: 'Test',
        latitude: 47.4784,
        longitude: -0.5632,
      };
      mockChantierCreate.mockResolvedValue({ id: 'new', ...createDto });

      const result = await service.create(createDto as any);

      expect(result.latitude).toBe(47.4784);
      expect(result.longitude).toBe(-0.5632);
    });

    it('should create chantier with multiple typePrestation', async () => {
      const createDto = {
        clientId: 'client-123',
        adresse: '123 Rue Test',
        codePostal: '49000',
        ville: 'Angers',
        typePrestation: ['paysagisme', 'entretien', 'elagage'],
        description: 'Test',
      };
      mockChantierCreate.mockResolvedValue({ id: 'new', ...createDto });

      const result = await service.create(createDto as any);

      expect(result.typePrestation).toHaveLength(3);
    });
  });

  describe('update', () => {
    it('should update chantier successfully', async () => {
      const chantierWithIncludes = { ...mockChantier, client: mockClient, responsable: null, devis: [], interventions: [] };
      mockChantierFindUnique.mockResolvedValue(chantierWithIncludes);
      const updateDto = { description: 'Updated description' };
      mockChantierUpdate.mockResolvedValue({
        ...mockChantier,
        ...updateDto,
        client: mockClient,
      });

      const result = await service.update('chantier-123', updateDto);

      expect(result.description).toBe('Updated description');
    });

    it('should throw NotFoundException when updating non-existent chantier', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { description: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete chantier successfully', async () => {
      const chantierWithIncludes = { ...mockChantier, client: mockClient, responsable: null, devis: [], interventions: [] };
      mockChantierFindUnique.mockResolvedValue(chantierWithIncludes);
      mockChantierDelete.mockResolvedValue(mockChantier);

      const result = await service.remove('chantier-123');

      expect(result).toEqual(mockChantier);
      expect(mockChantierDelete).toHaveBeenCalledWith({
        where: { id: 'chantier-123' },
      });
    });

    it('should throw NotFoundException when deleting non-existent chantier', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatut', () => {
    it('should update statut successfully', async () => {
      const chantierWithIncludes = { ...mockChantier, client: mockClient, responsable: null, devis: [], interventions: [] };
      mockChantierFindUnique.mockResolvedValue(chantierWithIncludes);
      mockChantierUpdate.mockResolvedValue({
        ...mockChantier,
        statut: 'en_cours',
      });

      const result = await service.updateStatut('chantier-123', 'en_cours');

      expect(result.statut).toBe('en_cours');
      expect(mockChantierUpdate).toHaveBeenCalledWith({
        where: { id: 'chantier-123' },
        data: { statut: 'en_cours' },
      });
    });

    it('should throw NotFoundException when chantier not found', async () => {
      mockChantierFindUnique.mockResolvedValue(null);

      await expect(
        service.updateStatut('non-existent', 'en_cours'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
