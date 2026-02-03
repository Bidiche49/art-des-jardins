import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

// Mock modules with ESM dependencies
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234'),
}));

jest.mock('../storage/storage.service', () => ({
  StorageService: jest.fn(),
}));

jest.mock('../mail/mail.service', () => ({
  MailService: jest.fn(),
}));

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: any;

  beforeEach(async () => {
    const mockHealthService = {
      checkLiveness: jest.fn().mockResolvedValue({ status: 'ok', timestamp: new Date() }),
      checkReadiness: jest.fn().mockResolvedValue({ status: 'ok', database: true }),
      getDetailedHealth: jest.fn().mockResolvedValue({
        status: 'healthy',
        services: {
          database: { status: 'up', latencyMs: 5, lastCheck: new Date() },
          storage: { status: 'up', latencyMs: 10, lastCheck: new Date() },
          smtp: { status: 'up', latencyMs: 2, lastCheck: new Date() },
        },
        timestamp: new Date(),
        uptime: 1000,
        version: '1.0.0',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthService, useValue: mockHealthService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', () => {
      const result = controller.check();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.uptime).toBe('number');
    });

    it('should return valid ISO timestamp', () => {
      const result = controller.check();
      const date = new Date(result.timestamp);

      expect(date.toISOString()).toBe(result.timestamp);
    });

    it('should return positive uptime', () => {
      const result = controller.check();

      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('liveness', () => {
    it('should call healthService.checkLiveness', async () => {
      const result = await controller.liveness();

      expect(healthService.checkLiveness).toHaveBeenCalled();
      expect(result.status).toBe('ok');
    });
  });

  describe('readiness', () => {
    it('should call healthService.checkReadiness', async () => {
      const result = await controller.readiness();

      expect(healthService.checkReadiness).toHaveBeenCalled();
      expect(result.status).toBe('ok');
      expect(result.database).toBe(true);
    });
  });

  describe('detailed', () => {
    it('should call healthService.getDetailedHealth', async () => {
      const result = await controller.detailed();

      expect(healthService.getDetailedHealth).toHaveBeenCalled();
      expect(result.status).toBe('healthy');
      expect(result.services).toBeDefined();
    });
  });
});
