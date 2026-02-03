import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAuditService } from './security-audit.service';
import { PrismaService } from '../../database/prisma.service';
import { SecurityEventType } from './security-event.types';

describe('SecurityAuditService', () => {
  let service: SecurityAuditService;
  let mockAuditLogCreate: jest.Mock;

  const testIp = '192.168.1.1';
  const testUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
  const testUserId = 'user-123';

  beforeEach(async () => {
    mockAuditLogCreate = jest.fn().mockResolvedValue({ id: 'log-123' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityAuditService,
        {
          provide: PrismaService,
          useValue: {
            auditLog: {
              create: mockAuditLogCreate,
            },
          },
        },
      ],
    }).compile();

    service = module.get<SecurityAuditService>(SecurityAuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logSecurityEvent', () => {
    it('should create an audit log with security entite', async () => {
      await service.logSecurityEvent({
        type: SecurityEventType.LOGIN_SUCCESS,
        userId: testUserId,
        ip: testIp,
        userAgent: testUserAgent,
        severity: 'info',
      });

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          entite: 'security',
          action: 'LOGIN_SUCCESS',
          userId: testUserId,
          ipAddress: testIp,
          userAgent: testUserAgent,
        }),
      });
    });

    it('should auto-set timestamp if not provided', async () => {
      const beforeCall = new Date();

      await service.logSecurityEvent({
        type: SecurityEventType.LOGIN_SUCCESS,
        ip: testIp,
        userAgent: testUserAgent,
        severity: 'info',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      const timestamp = new Date(callArg.data.details.timestamp);

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
    });

    it('should use provided timestamp', async () => {
      const customTimestamp = new Date('2026-01-15T10:00:00Z');

      await service.logSecurityEvent({
        type: SecurityEventType.LOGIN_SUCCESS,
        ip: testIp,
        userAgent: testUserAgent,
        severity: 'info',
        timestamp: customTimestamp,
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details.timestamp).toBe('2026-01-15T10:00:00.000Z');
    });

    it('should include metadata in details', async () => {
      const metadata = { deviceId: 'device-123', reason: 'test' };

      await service.logSecurityEvent({
        type: SecurityEventType.LOGIN_SUCCESS,
        userId: testUserId,
        ip: testIp,
        userAgent: testUserAgent,
        severity: 'info',
        metadata,
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details).toEqual(
        expect.objectContaining({
          deviceId: 'device-123',
          reason: 'test',
        }),
      );
    });

    it('should include severity in details', async () => {
      await service.logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        ip: testIp,
        userAgent: testUserAgent,
        severity: 'critical',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details.severity).toBe('critical');
    });

    it('should handle missing userId', async () => {
      await service.logSecurityEvent({
        type: SecurityEventType.LOGIN_FAILED,
        ip: testIp,
        userAgent: testUserAgent,
        severity: 'warning',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.userId).toBeNull();
      expect(callArg.data.entiteId).toBeNull();
    });
  });

  describe('logLoginSuccess', () => {
    it('should log LOGIN_SUCCESS with info severity', async () => {
      await service.logLoginSuccess(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'LOGIN_SUCCESS',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'info',
          }),
        }),
      });
    });

    it('should include optional metadata', async () => {
      await service.logLoginSuccess(testUserId, testIp, testUserAgent, {
        deviceId: 'device-abc',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details.deviceId).toBe('device-abc');
    });
  });

  describe('logLoginFailed', () => {
    it('should log LOGIN_FAILED with warning severity', async () => {
      await service.logLoginFailed(testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'LOGIN_FAILED',
          details: expect.objectContaining({
            severity: 'warning',
          }),
        }),
      });
    });

    it('should include email and reason in metadata', async () => {
      await service.logLoginFailed(testIp, testUserAgent, {
        email: 'test@example.com',
        reason: 'invalid_password',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details).toEqual(
        expect.objectContaining({
          email: 'test@example.com',
          reason: 'invalid_password',
        }),
      );
    });
  });

  describe('logLogout', () => {
    it('should log LOGOUT with info severity', async () => {
      await service.logLogout(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'LOGOUT',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'info',
          }),
        }),
      });
    });
  });

  describe('log2FAEnabled', () => {
    it('should log 2FA_ENABLED with info severity', async () => {
      await service.log2FAEnabled(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: '2FA_ENABLED',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'info',
          }),
        }),
      });
    });
  });

  describe('log2FADisabled', () => {
    it('should log 2FA_DISABLED with warning severity', async () => {
      await service.log2FADisabled(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: '2FA_DISABLED',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'warning',
          }),
        }),
      });
    });
  });

  describe('log2FAFailed', () => {
    it('should log 2FA_FAILED with warning severity', async () => {
      await service.log2FAFailed(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: '2FA_FAILED',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'warning',
          }),
        }),
      });
    });

    it('should include attemptCount in metadata', async () => {
      await service.log2FAFailed(testUserId, testIp, testUserAgent, {
        attemptCount: 3,
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details.attemptCount).toBe(3);
    });
  });

  describe('logPasswordChanged', () => {
    it('should log PASSWORD_CHANGED with info severity', async () => {
      await service.logPasswordChanged(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'PASSWORD_CHANGED',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'info',
          }),
        }),
      });
    });
  });

  describe('logPasswordResetRequested', () => {
    it('should log PASSWORD_RESET_REQUESTED with info severity', async () => {
      await service.logPasswordResetRequested(testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'PASSWORD_RESET_REQUESTED',
          details: expect.objectContaining({
            severity: 'info',
          }),
        }),
      });
    });

    it('should include email in metadata', async () => {
      await service.logPasswordResetRequested(testIp, testUserAgent, {
        email: 'test@example.com',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details.email).toBe('test@example.com');
    });
  });

  describe('logTokenRefresh', () => {
    it('should log TOKEN_REFRESH with info severity', async () => {
      await service.logTokenRefresh(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'TOKEN_REFRESH',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'info',
          }),
        }),
      });
    });

    it('should include deviceId in metadata', async () => {
      await service.logTokenRefresh(testUserId, testIp, testUserAgent, {
        deviceId: 'device-xyz',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details.deviceId).toBe('device-xyz');
    });
  });

  describe('logTokenRevoked', () => {
    it('should log TOKEN_REVOKED with info severity', async () => {
      await service.logTokenRevoked(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'TOKEN_REVOKED',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'info',
          }),
        }),
      });
    });

    it('should include deviceId and reason in metadata', async () => {
      await service.logTokenRevoked(testUserId, testIp, testUserAgent, {
        deviceId: 'device-revoked',
        reason: 'user_request',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details).toEqual(
        expect.objectContaining({
          deviceId: 'device-revoked',
          reason: 'user_request',
        }),
      );
    });
  });

  describe('logPermissionDenied', () => {
    it('should log PERMISSION_DENIED with warning severity', async () => {
      await service.logPermissionDenied(testUserId, testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'PERMISSION_DENIED',
          userId: testUserId,
          details: expect.objectContaining({
            severity: 'warning',
          }),
        }),
      });
    });

    it('should include resource and action in metadata', async () => {
      await service.logPermissionDenied(testUserId, testIp, testUserAgent, {
        resource: '/admin/users',
        action: 'DELETE',
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details).toEqual(
        expect.objectContaining({
          resource: '/admin/users',
          action: 'DELETE',
        }),
      );
    });
  });

  describe('logRateLimitExceeded', () => {
    it('should log RATE_LIMIT_EXCEEDED with warning severity', async () => {
      await service.logRateLimitExceeded(testIp, testUserAgent);

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'RATE_LIMIT_EXCEEDED',
          details: expect.objectContaining({
            severity: 'warning',
          }),
        }),
      });
    });

    it('should include endpoint and limit in metadata', async () => {
      await service.logRateLimitExceeded(testIp, testUserAgent, {
        endpoint: '/api/login',
        limit: 5,
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.details).toEqual(
        expect.objectContaining({
          endpoint: '/api/login',
          limit: 5,
        }),
      );
    });
  });

  describe('logSuspiciousActivity', () => {
    it('should log SUSPICIOUS_ACTIVITY with critical severity', async () => {
      await service.logSuspiciousActivity(testIp, testUserAgent, {
        reason: 'multiple_failed_logins',
      });

      expect(mockAuditLogCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'SUSPICIOUS_ACTIVITY',
          details: expect.objectContaining({
            severity: 'critical',
            reason: 'multiple_failed_logins',
          }),
        }),
      });
    });

    it('should include userId if provided', async () => {
      await service.logSuspiciousActivity(testIp, testUserAgent, {
        reason: 'account_compromise',
        userId: testUserId,
      });

      const callArg = mockAuditLogCreate.mock.calls[0][0];
      expect(callArg.data.userId).toBe(testUserId);
    });
  });

  describe('all SecurityEventType values', () => {
    it('should correctly map all event types', async () => {
      // Test all event types are valid
      const allTypes = Object.values(SecurityEventType);

      for (const eventType of allTypes) {
        await service.logSecurityEvent({
          type: eventType,
          ip: testIp,
          userAgent: testUserAgent,
          severity: 'info',
        });
      }

      expect(mockAuditLogCreate).toHaveBeenCalledTimes(allTypes.length);
    });
  });
});
