import { Test, TestingModule } from '@nestjs/testing';
import { SecurityLogsController } from './security-logs.controller';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Response } from 'express';

describe('SecurityLogsController', () => {
  let controller: SecurityLogsController;
  let mockAuditService: {
    findSecurityLogs: jest.Mock;
    getSecurityStats: jest.Mock;
    exportSecurityLogsCsv: jest.Mock;
  };

  beforeEach(async () => {
    mockAuditService = {
      findSecurityLogs: jest.fn(),
      getSecurityStats: jest.fn(),
      exportSecurityLogsCsv: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityLogsController],
      providers: [
        { provide: AuditService, useValue: mockAuditService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SecurityLogsController>(SecurityLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated security logs', async () => {
      const mockResponse = {
        data: [
          {
            id: 'log-1',
            action: 'LOGIN_FAILED',
            entite: 'auth',
            userId: 'user-1',
            severity: 'warning',
            createdAt: new Date(),
          },
        ],
        meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
      };
      mockAuditService.findSecurityLogs.mockResolvedValue(mockResponse);

      const result = await controller.findAll({});

      expect(result).toEqual(mockResponse);
      expect(mockAuditService.findSecurityLogs).toHaveBeenCalledWith({});
    });

    it('should pass query parameters to service', async () => {
      mockAuditService.findSecurityLogs.mockResolvedValue({ data: [], meta: {} });

      const query = {
        type: 'LOGIN_FAILED',
        userId: 'user-123',
        from: '2026-01-01',
        to: '2026-01-31',
        severity: 'warning' as const,
        page: 2,
        limit: 25,
      };

      await controller.findAll(query);

      expect(mockAuditService.findSecurityLogs).toHaveBeenCalledWith(query);
    });

    it('should filter by severity', async () => {
      mockAuditService.findSecurityLogs.mockResolvedValue({ data: [], meta: {} });

      await controller.findAll({ severity: 'critical' });

      expect(mockAuditService.findSecurityLogs).toHaveBeenCalledWith({
        severity: 'critical',
      });
    });
  });

  describe('getStats', () => {
    it('should return security statistics', async () => {
      const mockStats = {
        totalByType: { LOGIN_FAILED: 10, LOGIN_SUCCESS: 50 },
        topFailedUsers: [{ userId: 'u1', email: 'test@test.com', count: 5 }],
        dailyTrend: [{ date: '2026-01-25', count: 10, failedCount: 2, successCount: 8 }],
        totalLogs: 60,
        criticalCount: 1,
      };
      mockAuditService.getSecurityStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(mockAuditService.getSecurityStats).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should pass date range to service', async () => {
      mockAuditService.getSecurityStats.mockResolvedValue({});

      await controller.getStats('2026-01-01', '2026-01-31');

      expect(mockAuditService.getSecurityStats).toHaveBeenCalledWith(
        '2026-01-01',
        '2026-01-31',
      );
    });
  });

  describe('exportCsv', () => {
    it('should return CSV file with correct headers', async () => {
      const csvContent = 'Date;Action;Severite;Utilisateur;Email;IP;UserAgent;Details\n2026-01-25;LOGIN_FAILED;warning;Test User;test@test.com;127.0.0.1;Mozilla;{}';
      mockAuditService.exportSecurityLogsCsv.mockResolvedValue(csvContent);

      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.exportCsv(mockResponse, {});

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/csv; charset=utf-8',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        expect.stringMatching(/attachment; filename="security_logs_\d{4}-\d{2}-\d{2}\.csv"/),
      );
      expect(mockResponse.send).toHaveBeenCalledWith(csvContent);
    });

    it('should pass query parameters to export', async () => {
      mockAuditService.exportSecurityLogsCsv.mockResolvedValue('');

      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      const query = { type: 'LOGIN_FAILED', userId: 'user-1' };
      await controller.exportCsv(mockResponse, query);

      expect(mockAuditService.exportSecurityLogsCsv).toHaveBeenCalledWith(query);
    });
  });

  describe('Guards', () => {
    it('should have JwtAuthGuard and RolesGuard applied', () => {
      const guards = Reflect.getMetadata('__guards__', SecurityLogsController);
      expect(guards).toBeDefined();
      expect(guards.length).toBe(2);
    });

    it('should require patron role', () => {
      const roles = Reflect.getMetadata('roles', SecurityLogsController);
      expect(roles).toContain('patron');
    });
  });
});
