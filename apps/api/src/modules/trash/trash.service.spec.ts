import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TrashService } from './trash.service';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';

describe('TrashService', () => {
  let service: TrashService;
  let prisma: any;
  let audit: any;

  const mockConfig = {
    get: jest.fn((key: string) => {
      if (key === 'SOFT_DELETE_RETENTION_DAYS') return '90';
      return undefined;
    }),
  };

  beforeEach(async () => {
    const mockPrisma = {
      client: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
      chantier: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
      devis: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
      facture: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
      intervention: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const mockAudit = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrashService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<TrashService>(TrashService);
    prisma = module.get(PrismaService);
    audit = module.get(AuditService);
  });

  describe('listDeleted', () => {
    it('should return deleted items with pagination', async () => {
      const mockDeleted = [
        { id: 'client-1', nom: 'Test', deletedAt: new Date() },
      ];
      prisma.client.findMany.mockResolvedValue(mockDeleted);
      prisma.client.count.mockResolvedValue(1);

      const result = await service.listDeleted('client', 1, 20);

      expect(result.data).toEqual(mockDeleted);
      expect(result.total).toBe(1);
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { deletedAt: { not: null } },
        skip: 0,
        take: 20,
        orderBy: { deletedAt: 'desc' },
      });
    });
  });

  describe('getDeleted', () => {
    it('should return a deleted item', async () => {
      const mockItem = { id: 'client-1', nom: 'Test', deletedAt: new Date() };
      prisma.client.findFirst.mockResolvedValue(mockItem);

      const result = await service.getDeleted('client', 'client-1');

      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      prisma.client.findFirst.mockResolvedValue(null);

      await expect(service.getDeleted('client', 'non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restore', () => {
    it('should restore a deleted item', async () => {
      const deletedItem = { id: 'client-1', nom: 'Test', deletedAt: new Date() };
      const restoredItem = { ...deletedItem, deletedAt: null };

      prisma.client.findFirst.mockResolvedValue(deletedItem);
      prisma.client.update.mockResolvedValue(restoredItem);

      const result = await service.restore('client', 'client-1', 'user-1');

      expect(result.deletedAt).toBeNull();
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { deletedAt: null },
      });
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'RESTORE',
          entite: 'Client',
        }),
      );
    });

    it('should throw NotFoundException if item not in trash', async () => {
      prisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.restore('client', 'non-existent', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('purge', () => {
    it('should permanently delete an item', async () => {
      const deletedItem = { id: 'client-1', nom: 'Test', deletedAt: new Date() };

      prisma.client.findFirst.mockResolvedValue(deletedItem);
      prisma.client.delete.mockResolvedValue(deletedItem);

      await service.purge('client', 'client-1', 'user-1');

      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: { id: 'client-1' },
      });
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'PURGE',
          entite: 'Client',
        }),
      );
    });

    it('should throw NotFoundException if item not in trash', async () => {
      prisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.purge('client', 'non-existent', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return stats for all entities', async () => {
      prisma.client.count.mockResolvedValue(5);
      prisma.chantier.count.mockResolvedValue(3);
      prisma.devis.count.mockResolvedValue(2);
      prisma.facture.count.mockResolvedValue(1);
      prisma.intervention.count.mockResolvedValue(4);

      const result = await service.getStats();

      expect(result).toEqual({
        client: 5,
        chantier: 3,
        devis: 2,
        facture: 1,
        intervention: 4,
        total: 15,
      });
    });
  });

  describe('softDelete', () => {
    it('should soft delete an item', async () => {
      const existingItem = { id: 'client-1', nom: 'Test', deletedAt: null };
      const deletedItem = { ...existingItem, deletedAt: new Date() };

      prisma.client.findUnique.mockResolvedValue(existingItem);
      prisma.client.update.mockResolvedValue(deletedItem);

      const result = await service.softDelete('client', 'client-1', 'user-1');

      expect(result.deletedAt).not.toBeNull();
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'SOFT_DELETE',
        }),
      );
    });

    it('should throw NotFoundException if item does not exist', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(
        service.softDelete('client', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if already deleted', async () => {
      const alreadyDeleted = { id: 'client-1', deletedAt: new Date() };
      prisma.client.findUnique.mockResolvedValue(alreadyDeleted);

      await expect(
        service.softDelete('client', 'client-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should cascade soft delete when requested', async () => {
      const existingClient = { id: 'client-1', deletedAt: null };
      const chantiers = [{ id: 'chantier-1' }];

      prisma.client.findUnique.mockResolvedValue(existingClient);
      prisma.client.update.mockResolvedValue({ ...existingClient, deletedAt: new Date() });
      prisma.chantier.findMany.mockResolvedValue(chantiers);
      prisma.chantier.updateMany.mockResolvedValue({ count: 1 });
      prisma.devis.updateMany.mockResolvedValue({ count: 0 });
      prisma.intervention.updateMany.mockResolvedValue({ count: 0 });

      await service.softDelete('client', 'client-1', 'user-1', true);

      expect(prisma.chantier.updateMany).toHaveBeenCalled();
    });
  });

  describe('autoPurge', () => {
    it('should purge items older than retention period', async () => {
      prisma.client.deleteMany.mockResolvedValue({ count: 2 });
      prisma.chantier.deleteMany.mockResolvedValue({ count: 1 });
      prisma.devis.deleteMany.mockResolvedValue({ count: 0 });
      prisma.facture.deleteMany.mockResolvedValue({ count: 0 });
      prisma.intervention.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.autoPurge();

      expect(result.purged).toBe(6);
    });
  });
});
