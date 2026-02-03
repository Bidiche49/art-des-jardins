import { ExecutionContext } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';

describe('CustomThrottlerGuard', () => {
  let guard: CustomThrottlerGuard;

  const createMockContext = (
    ip: string,
    forwardedFor?: string,
    method = 'GET',
    url = '/test',
  ): ExecutionContext => {
    const mockResponse = {
      setHeader: jest.fn(),
      headersSent: false,
    };

    const mockRequest = {
      ip,
      method,
      url,
      socket: { remoteAddress: ip },
      headers: {
        'x-forwarded-for': forwardedFor,
        'user-agent': 'test-agent',
      },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      getType: () => 'http',
      getArgs: () => [mockRequest, mockResponse],
      getArgByIndex: () => mockRequest,
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [{ name: 'default', ttl: 60000, limit: 100 }],
        }),
      ],
      providers: [CustomThrottlerGuard],
    }).compile();

    guard = module.get<CustomThrottlerGuard>(CustomThrottlerGuard);
  });

  describe('getTrackerFromRequest', () => {
    it('should return X-Forwarded-For IP if present', () => {
      const context = createMockContext('192.168.1.1', '203.0.113.50, 70.41.3.18');
      const tracker = (guard as any).getTrackerFromRequest(
        context.switchToHttp().getRequest(),
      );
      expect(tracker).toBe('203.0.113.50');
    });

    it('should return req.ip if no X-Forwarded-For', () => {
      const context = createMockContext('192.168.1.1');
      const tracker = (guard as any).getTrackerFromRequest(
        context.switchToHttp().getRequest(),
      );
      expect(tracker).toBe('192.168.1.1');
    });

    it('should handle array X-Forwarded-For header', () => {
      const mockRequest = {
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.1' },
        headers: {
          'x-forwarded-for': ['203.0.113.50', '70.41.3.18'],
        },
      };
      const tracker = (guard as any).getTrackerFromRequest(mockRequest);
      expect(tracker).toBe('203.0.113.50');
    });

    it('should return socket remoteAddress as fallback', () => {
      const mockRequest = {
        ip: undefined,
        socket: { remoteAddress: '10.0.0.5' },
        headers: {},
      };
      const tracker = (guard as any).getTrackerFromRequest(mockRequest);
      expect(tracker).toBe('10.0.0.5');
    });

    it('should return unknown if no IP available', () => {
      const mockRequest = {
        ip: undefined,
        socket: { remoteAddress: undefined },
        headers: {},
      };
      const tracker = (guard as any).getTrackerFromRequest(mockRequest);
      expect(tracker).toBe('unknown');
    });
  });

  describe('isWhitelisted', () => {
    it('should whitelist 127.0.0.1', () => {
      const result = (guard as any).isWhitelisted('127.0.0.1');
      expect(result).toBe(true);
    });

    it('should whitelist ::1 (IPv6 localhost)', () => {
      const result = (guard as any).isWhitelisted('::1');
      expect(result).toBe(true);
    });

    it('should whitelist localhost', () => {
      const result = (guard as any).isWhitelisted('localhost');
      expect(result).toBe(true);
    });

    it('should whitelist 10.x.x.x private range', () => {
      expect((guard as any).isWhitelisted('10.0.0.1')).toBe(true);
      expect((guard as any).isWhitelisted('10.255.255.255')).toBe(true);
      expect((guard as any).isWhitelisted('10.100.50.25')).toBe(true);
    });

    it('should whitelist 172.16.x.x - 172.31.x.x private range', () => {
      expect((guard as any).isWhitelisted('172.16.0.1')).toBe(true);
      expect((guard as any).isWhitelisted('172.20.100.50')).toBe(true);
      expect((guard as any).isWhitelisted('172.31.255.255')).toBe(true);
    });

    it('should NOT whitelist 172.15.x.x (outside private range)', () => {
      expect((guard as any).isWhitelisted('172.15.0.1')).toBe(false);
    });

    it('should NOT whitelist 172.32.x.x (outside private range)', () => {
      expect((guard as any).isWhitelisted('172.32.0.1')).toBe(false);
    });

    it('should whitelist 192.168.x.x private range', () => {
      expect((guard as any).isWhitelisted('192.168.0.1')).toBe(true);
      expect((guard as any).isWhitelisted('192.168.1.100')).toBe(true);
      expect((guard as any).isWhitelisted('192.168.255.255')).toBe(true);
    });

    it('should NOT whitelist public IPs', () => {
      expect((guard as any).isWhitelisted('8.8.8.8')).toBe(false);
      expect((guard as any).isWhitelisted('203.0.113.50')).toBe(false);
      expect((guard as any).isWhitelisted('1.2.3.4')).toBe(false);
      expect((guard as any).isWhitelisted('74.125.224.72')).toBe(false);
    });

    it('should NOT whitelist 192.167.x.x (similar but not private)', () => {
      expect((guard as any).isWhitelisted('192.167.1.1')).toBe(false);
    });
  });

  describe('canActivate with whitelisted IPs', () => {
    it('should allow whitelisted IP (127.0.0.1) without rate limiting', async () => {
      const context = createMockContext('127.0.0.1');

      // Mock the parent canActivate to track if it's called
      const parentSpy = jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      // Parent should NOT be called for whitelisted IPs
      expect(parentSpy).not.toHaveBeenCalled();

      parentSpy.mockRestore();
    });

    it('should allow whitelisted IP (private range 10.x) without rate limiting', async () => {
      const context = createMockContext('10.0.0.5');

      const parentSpy = jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(parentSpy).not.toHaveBeenCalled();

      parentSpy.mockRestore();
    });

    it('should call parent canActivate for public IPs', async () => {
      const context = createMockContext('203.0.113.50');

      const parentSpy = jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(parentSpy).toHaveBeenCalledWith(context);

      parentSpy.mockRestore();
    });

    it('should use X-Forwarded-For for IP detection', async () => {
      // Even though direct IP is 127.0.0.1, X-Forwarded-For is public
      const context = createMockContext('127.0.0.1', '203.0.113.50');

      const parentSpy = jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      await guard.canActivate(context);

      // Should call parent because X-Forwarded-For IP is public
      expect(parentSpy).toHaveBeenCalled();

      parentSpy.mockRestore();
    });
  });

  describe('canActivate error handling', () => {
    it('should log warning and rethrow ThrottlerException', async () => {
      const context = createMockContext('203.0.113.50');

      const throttlerError = new ThrottlerException('Too many requests');
      jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'canActivate')
        .mockRejectedValue(throttlerError);

      const loggerSpy = jest.spyOn((guard as any).logger, 'warn');

      await expect(guard.canActivate(context)).rejects.toThrow(ThrottlerException);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Rate limit exceeded'),
        expect.objectContaining({
          ip: '203.0.113.50',
          method: 'GET',
          url: '/test',
        }),
      );
    });

    it('should rethrow non-ThrottlerException errors without logging', async () => {
      const context = createMockContext('203.0.113.50');

      const genericError = new Error('Some other error');
      jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'canActivate')
        .mockRejectedValue(genericError);

      const loggerSpy = jest.spyOn((guard as any).logger, 'warn');

      await expect(guard.canActivate(context)).rejects.toThrow('Some other error');

      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleRequest headers', () => {
    it('should set X-RateLimit headers on successful request', async () => {
      const context = createMockContext('203.0.113.50');
      const res = context.switchToHttp().getResponse();

      const mockRequestProps = {
        context,
        limit: 100,
        ttl: 60000,
        throttler: { name: 'default', limit: 100, ttl: 60000 },
        blockDuration: 0,
        getTracker: async () => '203.0.113.50',
        generateKey: async () => 'key',
      };

      jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'handleRequest')
        .mockResolvedValue(true);

      const result = await (guard as any).handleRequest(mockRequestProps);

      expect(result).toBe(true);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Policy', '100;w=60');
    });

    it('should set Retry-After and rate limit headers on throttled request', async () => {
      const context = createMockContext('203.0.113.50');
      const res = context.switchToHttp().getResponse();

      const mockRequestProps = {
        context,
        limit: 100,
        ttl: 60000,
        throttler: { name: 'default', limit: 100, ttl: 60000 },
        blockDuration: 0,
        getTracker: async () => '203.0.113.50',
        generateKey: async () => 'key',
      };

      const throttlerError = new ThrottlerException('Too many requests');
      jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'handleRequest')
        .mockRejectedValue(throttlerError);

      await expect((guard as any).handleRequest(mockRequestProps)).rejects.toThrow(ThrottlerException);

      expect(res.setHeader).toHaveBeenCalledWith('Retry-After', '60');
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(String));
    });

    it('should not set headers if headersSent is true', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        headersSent: true,
      };

      const mockRequest = {
        ip: '203.0.113.50',
        method: 'GET',
        url: '/test',
        socket: { remoteAddress: '203.0.113.50' },
        headers: {},
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
          getResponse: () => mockResponse,
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as unknown as ExecutionContext;

      const mockRequestProps = {
        context,
        limit: 100,
        ttl: 60000,
        throttler: { name: 'default', limit: 100, ttl: 60000 },
        blockDuration: 0,
        getTracker: async () => '203.0.113.50',
        generateKey: async () => 'key',
      };

      jest.spyOn(Object.getPrototypeOf(CustomThrottlerGuard.prototype), 'handleRequest')
        .mockResolvedValue(true);

      await (guard as any).handleRequest(mockRequestProps);

      // Headers should not be set because headersSent is true
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
    });
  });
});
