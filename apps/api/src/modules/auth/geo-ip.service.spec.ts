import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeoIpService } from './geo-ip.service';

describe('GeoIpService', () => {
  let service: GeoIpService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, number> = {
        GEOIP_CACHE_HOURS: 24,
        GEOIP_TIMEOUT_MS: 2000,
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoIpService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<GeoIpService>(GeoIpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    service.clearCache();
  });

  describe('lookup', () => {
    it('should return geolocation data for valid IP', async () => {
      const mockResponse = {
        status: 'success',
        country: 'France',
        countryCode: 'FR',
        region: 'IDF',
        regionName: 'Ile-de-France',
        city: 'Paris',
        lat: 48.8566,
        lon: 2.3522,
        timezone: 'Europe/Paris',
        isp: 'Orange',
        query: '203.0.113.1',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.lookup('203.0.113.1');

      expect(result).toEqual({
        ip: '203.0.113.1',
        country: 'France',
        countryCode: 'FR',
        region: 'Ile-de-France',
        city: 'Paris',
        lat: 48.8566,
        lon: 2.3522,
        timezone: 'Europe/Paris',
        isp: 'Orange',
      });
    });

    it('should return null for private IPs', async () => {
      const privateIps = [
        '127.0.0.1',
        'localhost',
        '::1',
        '10.0.0.1',
        '172.16.0.1',
        '172.31.255.255',
        '192.168.1.1',
      ];

      for (const ip of privateIps) {
        const result = await service.lookup(ip);
        expect(result).toBeNull();
      }

      // Should not have called the API for any private IP
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should cache results', async () => {
      const mockResponse = {
        status: 'success',
        country: 'France',
        countryCode: 'FR',
        city: 'Paris',
        query: '203.0.113.1',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // First call - should hit API
      const result1 = await service.lookup('203.0.113.1');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await service.lookup('203.0.113.1');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1, not 2

      expect(result1).toEqual(result2);
    });

    it('should return null on API failure', async () => {
      const mockResponse = {
        status: 'fail',
        message: 'invalid query',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.lookup('invalid-ip');

      expect(result).toBeNull();
    });

    it('should return null on HTTP error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await service.lookup('203.0.113.1');

      expect(result).toBeNull();
    });

    it('should return null on timeout', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => {
        return new Promise((_, reject) => {
          const error = new Error('Aborted');
          error.name = 'AbortError';
          reject(error);
        });
      });

      const result = await service.lookup('203.0.113.1');

      expect(result).toBeNull();
    });

    it('should return null on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await service.lookup('203.0.113.1');

      expect(result).toBeNull();
    });

    it('should handle missing optional fields', async () => {
      const mockResponse = {
        status: 'success',
        query: '203.0.113.1',
        // Missing all optional fields
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.lookup('203.0.113.1');

      expect(result).toEqual({
        ip: '203.0.113.1',
        country: 'Inconnu',
        countryCode: '',
        region: '',
        city: 'Inconnu',
        lat: undefined,
        lon: undefined,
        timezone: undefined,
        isp: undefined,
      });
    });
  });

  describe('clearCache', () => {
    it('should clear all cached entries', async () => {
      const mockResponse = {
        status: 'success',
        country: 'France',
        countryCode: 'FR',
        city: 'Paris',
        query: '203.0.113.1',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // Populate cache
      await service.lookup('203.0.113.1');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Clear cache
      service.clearCache();

      // Should hit API again after cache clear
      await service.lookup('203.0.113.1');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('isPrivateIp (via lookup)', () => {
    it('should identify all private IP ranges', async () => {
      const testCases = [
        { ip: '127.0.0.1', private: true },
        { ip: '10.0.0.1', private: true },
        { ip: '10.255.255.255', private: true },
        { ip: '172.16.0.1', private: true },
        { ip: '172.31.255.255', private: true },
        { ip: '172.15.0.1', private: false }, // Not in 172.16-31 range
        { ip: '172.32.0.1', private: false }, // Not in 172.16-31 range
        { ip: '192.168.0.1', private: true },
        { ip: '192.168.255.255', private: true },
        { ip: '8.8.8.8', private: false },
        { ip: '203.0.113.1', private: false },
      ];

      const mockResponse = {
        status: 'success',
        country: 'France',
        countryCode: 'FR',
        city: 'Paris',
        query: '',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      for (const testCase of testCases) {
        // Clear cache between tests
        service.clearCache();
        jest.clearAllMocks();

        await service.lookup(testCase.ip);

        if (testCase.private) {
          expect(global.fetch).not.toHaveBeenCalled();
        } else {
          expect(global.fetch).toHaveBeenCalled();
        }
      }
    });
  });
});
