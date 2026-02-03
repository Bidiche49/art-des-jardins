import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../../database/prisma.service';
import { SecurityAlertService } from '../alerts/security-alert.service';
import { createMockAuditLog, createMockUser } from '../../../test/helpers/test-utils';

describe('AuditService', () => {
  let service: AuditService;
  let mockAuditLogCreate: jest.Mock;
  let mockAuditLogFindMany: jest.Mock;
  let mockAuditLogCount: jest.Mock;
  let mockAuditLogGroupBy: jest.Mock;
  let mockUserFindMany: jest.Mock;
  let mockSecurityAlertCheckAndAlert: jest.Mock;

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
    mockAuditLogGroupBy = jest.fn();
    mockUserFindMany = jest.fn();
    mockSecurityAlertCheckAndAlert = jest.fn().mockResolvedValue(undefined);

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
              groupBy: mockAuditLogGroupBy,
            },
            user: {
              findMany: mockUserFindMany,
            },
          },
        },
        {
          provide: SecurityAlertService,
          useValue: {
            checkAndAlert: mockSecurityAlertCheckAndAlert,
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

    it('should call security alert check for auth events', async () => {
      const logData = {
        userId: 'user-123',
        action: 'LOGIN_FAILED',
        entite: 'auth',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      };
      mockAuditLogCreate.mockResolvedValue({ id: 'log-123', ...logData });

      await service.log(logData);

      // Wait for async security check
      await new Promise((r) => setTimeout(r, 10));

      expect(mockSecurityAlertCheckAndAlert).toHaveBeenCalledWith({
        action: 'LOGIN_FAILED',
        userId: 'user-123',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        details: undefined,
      });
    });

    it('should not call security alert for non-auth events', async () => {
      const logData = {
        userId: 'user-123',
        action: 'CREATE',
        entite: 'Client',
      };
      mockAuditLogCreate.mockResolvedValue({ id: 'log-123', ...logData });

      await service.log(logData);

      expect(mockSecurityAlertCheckAndAlert).not.toHaveBeenCalled();
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

  // =====================================================
  // Security Logs Tests
  // =====================================================

  describe('findSecurityLogs', () => {
    const mockSecurityLog = createMockAuditLog({
      id: 'sec-log-1',
      userId: 'user-123',
      action: 'LOGIN_FAILED',
      entite: 'auth',
    });

    it('should return paginated security logs filtered by auth/security entite', async () => {
      mockAuditLogFindMany.mockResolvedValue([
        { ...mockSecurityLog, user: mockUser },
      ]);
      mockAuditLogCount.mockResolvedValue(1);

      const result = await service.findSecurityLogs({});

      expect(result.data).toHaveLength(1);
      expect(result.data[0].severity).toBe('warning');
      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            entite: { in: ['auth', 'security'] },
          }),
        }),
      );
    });

    it('should filter by action type', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      await service.findSecurityLogs({ type: 'LOGIN_FAILED' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: 'LOGIN_FAILED',
          }),
        }),
      );
    });

    it('should filter by userId', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      await service.findSecurityLogs({ userId: 'user-456' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-456',
          }),
        }),
      );
    });

    it('should filter by date range', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      await service.findSecurityLogs({
        from: '2026-01-01',
        to: '2026-01-31',
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

    it('should filter by severity critical', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      await service.findSecurityLogs({ severity: 'critical' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: {
              in: ['SUSPICIOUS_ACTIVITY', 'BRUTEFORCE_DETECTED', 'BRUTEFORCE_IP_DETECTED'],
            },
          }),
        }),
      );
    });

    it('should filter by severity warning', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      await service.findSecurityLogs({ severity: 'warning' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: {
              in: ['LOGIN_FAILED', 'PASSWORD_RESET_REQUESTED', 'ACCOUNT_LOCKED'],
            },
          }),
        }),
      );
    });

    it('should return empty if type does not match severity filter', async () => {
      const result = await service.findSecurityLogs({
        type: 'LOGIN_SUCCESS',
        severity: 'critical',
      });

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should correctly assign severity to logs', async () => {
      const criticalLog = { ...mockSecurityLog, action: 'SUSPICIOUS_ACTIVITY', user: mockUser };
      const warningLog = { ...mockSecurityLog, action: 'LOGIN_FAILED', user: mockUser };
      const infoLog = { ...mockSecurityLog, action: 'LOGIN_SUCCESS', user: mockUser };

      mockAuditLogFindMany.mockResolvedValue([criticalLog, warningLog, infoLog]);
      mockAuditLogCount.mockResolvedValue(3);

      const result = await service.findSecurityLogs({});

      expect(result.data[0].severity).toBe('critical');
      expect(result.data[1].severity).toBe('warning');
      expect(result.data[2].severity).toBe('info');
    });

    it('should apply pagination', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(100);

      const result = await service.findSecurityLogs({ page: 3, limit: 20 });

      expect(result.meta).toEqual({
        total: 100,
        page: 3,
        limit: 20,
        totalPages: 5,
      });
      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 40,
          take: 20,
        }),
      );
    });
  });

  describe('getSecurityStats', () => {
    it('should return stats with total by type', async () => {
      mockAuditLogGroupBy
        .mockResolvedValueOnce([
          { action: 'LOGIN_FAILED', _count: { action: 10 } },
          { action: 'LOGIN_SUCCESS', _count: { action: 50 } },
        ])
        .mockResolvedValueOnce([
          { userId: 'user-1', _count: { userId: 5 } },
        ]);
      mockUserFindMany.mockResolvedValue([
        { id: 'user-1', email: 'test@test.com', nom: 'Test', prenom: 'User' },
      ]);
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValueOnce(60).mockResolvedValueOnce(1);

      const result = await service.getSecurityStats();

      expect(result.totalByType).toEqual({
        LOGIN_FAILED: 10,
        LOGIN_SUCCESS: 50,
      });
      expect(result.totalLogs).toBe(60);
      expect(result.criticalCount).toBe(1);
    });

    it('should return top failed users', async () => {
      mockAuditLogGroupBy
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { userId: 'user-1', _count: { userId: 10 } },
          { userId: 'user-2', _count: { userId: 5 } },
        ]);
      mockUserFindMany.mockResolvedValue([
        { id: 'user-1', email: 'user1@test.com', nom: 'Dupont', prenom: 'Jean' },
        { id: 'user-2', email: 'user2@test.com', nom: 'Martin', prenom: 'Marie' },
      ]);
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      const result = await service.getSecurityStats();

      expect(result.topFailedUsers).toHaveLength(2);
      expect(result.topFailedUsers[0]).toEqual({
        userId: 'user-1',
        email: 'user1@test.com',
        nom: 'Dupont',
        prenom: 'Jean',
        count: 10,
      });
    });

    it('should return daily trend for last 7 days', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockAuditLogGroupBy.mockResolvedValue([]);
      mockUserFindMany.mockResolvedValue([]);
      mockAuditLogFindMany.mockResolvedValue([
        { action: 'LOGIN_SUCCESS', createdAt: new Date() },
        { action: 'LOGIN_FAILED', createdAt: new Date() },
        { action: 'LOGIN_SUCCESS', createdAt: new Date() },
      ]);
      mockAuditLogCount.mockResolvedValue(0);

      const result = await service.getSecurityStats();

      expect(result.dailyTrend.length).toBeGreaterThan(0);
      expect(result.dailyTrend[0]).toHaveProperty('date');
      expect(result.dailyTrend[0]).toHaveProperty('count');
      expect(result.dailyTrend[0]).toHaveProperty('failedCount');
      expect(result.dailyTrend[0]).toHaveProperty('successCount');
    });

    it('should apply date range filter', async () => {
      mockAuditLogGroupBy.mockResolvedValue([]);
      mockUserFindMany.mockResolvedValue([]);
      mockAuditLogFindMany.mockResolvedValue([]);
      mockAuditLogCount.mockResolvedValue(0);

      await service.getSecurityStats('2026-01-01', '2026-01-31');

      expect(mockAuditLogGroupBy).toHaveBeenCalledWith(
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
  });

  describe('exportSecurityLogsCsv', () => {
    it('should generate CSV with security-specific headers', async () => {
      const logWithUser = {
        ...mockLog,
        action: 'LOGIN_FAILED',
        entite: 'auth',
        createdAt: new Date('2026-01-25T10:00:00Z'),
        user: { nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com' },
      };
      mockAuditLogFindMany.mockResolvedValue([logWithUser]);

      const csv = await service.exportSecurityLogsCsv({});

      expect(csv).toContain('Date;Action;Severite;Utilisateur;Email;IP;UserAgent;Details');
      expect(csv).toContain('LOGIN_FAILED');
      expect(csv).toContain('warning');
      expect(csv).toContain('Jean Dupont');
    });

    it('should filter by auth/security entite', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);

      await service.exportSecurityLogsCsv({});

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            entite: { in: ['auth', 'security'] },
          }),
        }),
      );
    });

    it('should escape semicolons in user agent', async () => {
      const logWithSemicolon = {
        ...mockLog,
        action: 'LOGIN_SUCCESS',
        entite: 'auth',
        userAgent: 'Mozilla/5.0; Windows NT',
        createdAt: new Date(),
        user: mockUser,
      };
      mockAuditLogFindMany.mockResolvedValue([logWithSemicolon]);

      const csv = await service.exportSecurityLogsCsv({});

      expect(csv).toContain('Mozilla/5.0, Windows NT');
    });

    it('should apply type filter', async () => {
      mockAuditLogFindMany.mockResolvedValue([]);

      await service.exportSecurityLogsCsv({ type: 'SUSPICIOUS_ACTIVITY' });

      expect(mockAuditLogFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: 'SUSPICIOUS_ACTIVITY',
          }),
        }),
      );
    });
  });
});
