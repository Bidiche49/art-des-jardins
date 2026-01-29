import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../../database/prisma.service';
import {
  createMockClient,
  createMockClientPro,
  createMockClientSyndic,
} from '../../../test/helpers/test-utils';

describe('ClientsService', () => {
  let service: ClientsService;
  let mockClientFindMany: jest.Mock;
  let mockClientFindUnique: jest.Mock;
  let mockClientCreate: jest.Mock;
  let mockClientUpdate: jest.Mock;
  let mockClientDelete: jest.Mock;
  let mockClientCount: jest.Mock;

  const mockClient = createMockClient({ id: 'client-123' });
  const mockClientPro = createMockClientPro({ id: 'client-pro-123' });
  const mockClientSyndic = createMockClientSyndic({ id: 'client-syndic-123' });
  const mockClients = [mockClient, mockClientPro, mockClientSyndic];

  beforeEach(async () => {
    mockClientFindMany = jest.fn();
    mockClientFindUnique = jest.fn();
    mockClientCreate = jest.fn();
    mockClientUpdate = jest.fn();
    mockClientDelete = jest.fn();
    mockClientCount = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              findMany: mockClientFindMany,
              findUnique: mockClientFindUnique,
              create: mockClientCreate,
              update: mockClientUpdate,
              delete: mockClientDelete,
              count: mockClientCount,
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated clients with default pagination', async () => {
      mockClientFindMany.mockResolvedValue(mockClients);
      mockClientCount.mockResolvedValue(3);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: mockClients,
        meta: {
          total: 3,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      });
      expect(mockClientFindMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should apply custom pagination', async () => {
      mockClientFindMany.mockResolvedValue([mockClient]);
      mockClientCount.mockResolvedValue(25);

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 5,
        totalPages: 5,
      });
      expect(mockClientFindMany).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by type particulier', async () => {
      mockClientFindMany.mockResolvedValue([mockClient]);
      mockClientCount.mockResolvedValue(1);

      await service.findAll({ type: 'particulier' });

      expect(mockClientFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'particulier' },
        }),
      );
    });

    it('should filter by type professionnel', async () => {
      mockClientFindMany.mockResolvedValue([mockClientPro]);
      mockClientCount.mockResolvedValue(1);

      await service.findAll({ type: 'professionnel' });

      expect(mockClientFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'professionnel' },
        }),
      );
    });

    it('should filter by type syndic', async () => {
      mockClientFindMany.mockResolvedValue([mockClientSyndic]);
      mockClientCount.mockResolvedValue(1);

      await service.findAll({ type: 'syndic' });

      expect(mockClientFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'syndic' },
        }),
      );
    });

    it('should filter by ville', async () => {
      mockClientFindMany.mockResolvedValue([mockClient]);
      mockClientCount.mockResolvedValue(1);

      await service.findAll({ ville: 'Angers' });

      expect(mockClientFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { ville: { contains: 'Angers', mode: 'insensitive' } },
        }),
      );
    });

    it('should apply full-text search', async () => {
      mockClientFindMany.mockResolvedValue([mockClient]);
      mockClientCount.mockResolvedValue(1);

      await service.findAll({ search: 'Martin' });

      expect(mockClientFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { nom: { contains: 'Martin', mode: 'insensitive' } },
              { prenom: { contains: 'Martin', mode: 'insensitive' } },
              { email: { contains: 'Martin', mode: 'insensitive' } },
              { raisonSociale: { contains: 'Martin', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('should combine multiple filters', async () => {
      mockClientFindMany.mockResolvedValue([]);
      mockClientCount.mockResolvedValue(0);

      await service.findAll({
        type: 'particulier',
        ville: 'Angers',
        search: 'test',
      });

      expect(mockClientFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'particulier',
            ville: { contains: 'Angers', mode: 'insensitive' },
            OR: expect.any(Array),
          }),
        }),
      );
    });

    it('should return empty array when no clients found', async () => {
      mockClientFindMany.mockResolvedValue([]);
      mockClientCount.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return client with chantiers when found', async () => {
      const clientWithChantiers = { ...mockClient, chantiers: [] };
      mockClientFindUnique.mockResolvedValue(clientWithChantiers);

      const result = await service.findOne('client-123');

      expect(result).toEqual(clientWithChantiers);
      expect(mockClientFindUnique).toHaveBeenCalledWith({
        where: { id: 'client-123' },
        include: {
          chantiers: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
    });

    it('should throw NotFoundException when client not found', async () => {
      mockClientFindUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        'Client non-existent non trouve',
      );
    });
  });

  describe('create', () => {
    it('should create a particulier client', async () => {
      const createDto = {
        type: 'particulier' as const,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com',
        telephone: '0612345678',
        adresse: '123 Rue Test',
        codePostal: '49000',
        ville: 'Angers',
      };
      mockClientCreate.mockResolvedValue({ id: 'new-id', ...createDto });

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id');
      expect(mockClientCreate).toHaveBeenCalledWith({ data: createDto });
    });

    it('should create a professionnel client with raisonSociale', async () => {
      const createDto = {
        type: 'professionnel' as const,
        nom: 'Contact',
        raisonSociale: 'Entreprise ABC',
        email: 'contact@entreprise.com',
        telephone: '0612345678',
        adresse: '123 Rue Pro',
        codePostal: '49000',
        ville: 'Angers',
      };
      mockClientCreate.mockResolvedValue({ id: 'new-id', ...createDto });

      const result = await service.create(createDto);

      expect(result.type).toBe('professionnel');
      expect(result.raisonSociale).toBe('Entreprise ABC');
    });

    it('should create a syndic client', async () => {
      const createDto = {
        type: 'syndic' as const,
        nom: 'Gestionnaire',
        raisonSociale: 'Syndic Copro',
        email: 'syndic@example.com',
        telephone: '0612345678',
        adresse: '123 Rue Syndic',
        codePostal: '49000',
        ville: 'Angers',
      };
      mockClientCreate.mockResolvedValue({ id: 'new-id', ...createDto });

      const result = await service.create(createDto);

      expect(result.type).toBe('syndic');
    });
  });

  describe('update', () => {
    it('should update client successfully', async () => {
      mockClientFindUnique.mockResolvedValue(mockClient);
      const updateDto = { nom: 'Updated Name' };
      mockClientUpdate.mockResolvedValue({ ...mockClient, ...updateDto });

      const result = await service.update('client-123', updateDto);

      expect(result.nom).toBe('Updated Name');
      expect(mockClientUpdate).toHaveBeenCalledWith({
        where: { id: 'client-123' },
        data: updateDto,
      });
    });

    it('should update partial fields', async () => {
      mockClientFindUnique.mockResolvedValue(mockClient);
      const updateDto = { telephone: '0600000000', notes: 'Updated notes' };
      mockClientUpdate.mockResolvedValue({ ...mockClient, ...updateDto });

      const result = await service.update('client-123', updateDto);

      expect(result.telephone).toBe('0600000000');
      expect(result.notes).toBe('Updated notes');
    });

    it('should throw NotFoundException when updating non-existent client', async () => {
      mockClientFindUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { nom: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete client successfully', async () => {
      mockClientFindUnique.mockResolvedValue(mockClient);
      mockClientDelete.mockResolvedValue(mockClient);

      const result = await service.remove('client-123');

      expect(result).toEqual(mockClient);
      expect(mockClientDelete).toHaveBeenCalledWith({
        where: { id: 'client-123' },
      });
    });

    it('should throw NotFoundException when deleting non-existent client', async () => {
      mockClientFindUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
