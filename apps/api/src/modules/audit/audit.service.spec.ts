import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../../database/prisma.service';
import { createMockAuditLog, createMockUser } from '../../../test/helpers/test-utils';

describe('AuditService', () => {
  let service: AuditService;
  let mockAuditLogCreate: jest.Mock;
  let mockAuditLogFindMany: jest.Mock;
  let mockAuditLogCount: jest.Mock;

  const mockUser = createMockUser({ id: 'user-123' });
  const mockLog = createMockAuditLog({
    id: 'log-123',
    userId: 'user-123',
    action: 'CREATE',
    entite: 'Client',
    entiteId: 'client-123',
  });

  beforeEach(async () => {
    mockAuditLogCreate = jest.fn();
    mockAuditLogFindMany = jest.fn();
    mockAuditLogCount = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: PrismaService,
          useValue: {
            auditLog: {
              create: mockAuditLogCreate,
              findMany: mockAuditLogFindMany,
              count: mockAuditLogCount,
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should create audit log with all fields', async () => {
      const logData = {
        userId: 'user-123',
        action: 'CREATE',
        entite: 'Client',
        entiteId: 'client-123',
        details: { nom: 'Test' },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      };
      mockAuditLogCreate.mockResolvedValue({ id: 'new-log', ...logData });

      const result = await service.log(logData);

      expect(result).toHaveProperty('id');
      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: logData,
      });
    });

    it('should create log for UPDATE action', async () => {
      const logData = {
        userId: 'user-123',
        action: 'UPDATE',
        entite: 'Client',
        entiteId: 'client-123',
        details: { nom: 'Updated' },
      };
      mockAuditLogCreate.mockResolvedValue({ id: 'log', ...logData });

      await service.log(logData);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'UPDATE' }),
      });
    });

    it('should create log for DELETE action', async () => {
      const logData = {
        action: 'DELETE',
        entite: 'Client',
        entiteId: 'client-123',
      };
      mockAuditLogCreate.mockResolvedValue({ id: 'log', ...logData });

      await service.log(logData);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'DELETE' }),
      });
    });

    it('should create log without userId (system action)', async () => {
      const logData = {
        action: 'SYSTEM',
        entite: 'Sequence',
      };
      mockAuditLogCreate.mockResolvedValue({ id: 'log', ...logData });

      await service.log(logData);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: undefined }),
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated audit logs', async () => {
      mockAuditLogFindMany.mockResolvedValue([mockLog]);
      mockAuditLogCount.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: [mockLog],
        meta: {
          total: 1,
          page: 1,
          limit: 50,
          totalPages: 1,
        },
      });
    });

    it('should filter by userId', async () => {
      mockAuditLogFindMany.mockResolvedValue([mockLog]);
      mockAuditLogCount.mockResolvedValue(1);

      await service.findAll({ userId: 'user-123' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-123' }),
        }),
      );
    });

    it('should filter by action (case insensitive)', async () => {
      mockAuditLogFindMany.mockResolvedValue([mockLog]);
      mockAuditLogCount.mockResolvedValue(1);

      await service.findAll({ action: 'create' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: { contains: 'create', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should filter by entite', async () => {
      mockAuditLogFindMany.mockResolvedValue([mockLog]);
      mockAuditLogCount.mockResolvedValue(1);

      await service.findAll({ entite: 'Client' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ entite: 'Client' }),
        }),
      );
    });

    it('should filter by date range', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      await service.findAll({
        dateDebut: '2026-01-01',
        dateFin: '2026-01-31',
      });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: expect.any(Date),
              lte: expect.any(Date),
            },
          }),
        }),
      );
    });

    it('should apply custom pagination', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(100);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(result.meta).toEqual({
        total: 100,
        page: 2,
        limit: 10,
        totalPages: 10,
      });
      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  describe('exportCsv', () => {
    it('should generate CSV with headers', async () => {
      const logWithUser = {
        ...mockLog,
        createdAt: new Date('2026-01-25T10:00:00Z'),
        user: { nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com' },
      };
      mockAuditLogFindMany.mockResolvedValue([logWithUser]);

      const csv = await service.exportCsv({});

      expect(csv).toContain('Date;Utilisateur;Email;Action;Entite;EntiteId;IP;Details');
      expect(csv).toContain('Jean Dupont');
      expect(csv).toContain('jean@test.com');
      expect(csv).toContain('CREATE');
      expect(csv).toContain('Client');
    });

    it('should handle system logs without user', async () => {
      const systemLog = {
        ...mockLog,
        createdAt: new Date(),
        user: null,
      };
      mockAuditLogFindMany.mockResolvedValue([systemLog]);

      const csv = await service.exportCsv({});

      expect(csv).toContain('Systeme');
    });

    it('should include ISO date format', async () => {
      const logWithDate = {
        ...mockLog,
        createdAt: new Date('2026-01-25T10:00:00.000Z'),
        user: mockUser,
      };
      mockAuditLogFindMany.mockResolvedValue([logWithDate]);

      const csv = await service.exportCsv({});

      expect(csv).toContain('2026-01-25T10:00:00.000Z');
    });

    it('should apply filters to export', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);

      await service.exportCsv({ entite: 'Devis' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ entite: 'Devis' }),
        }),
      );
    });
  });
});
