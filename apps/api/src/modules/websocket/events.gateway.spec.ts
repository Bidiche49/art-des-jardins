import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from './events.gateway';
import { WS_EVENTS } from './websocket.events';
import { DEFAULT_COMPANY_ID } from './websocket.types';

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockServer = {
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
    jwtService = module.get<JwtService>(JwtService);

    // Inject mock server
    (gateway as any).server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should disconnect client without token', async () => {
      const mockClient = {
        id: 'test-client-1',
        handshake: { auth: {}, headers: {} },
        disconnect: jest.fn(),
        join: jest.fn(),
      };

      await gateway.handleConnection(mockClient as any);

      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should disconnect client with invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const mockClient = {
        id: 'test-client-2',
        handshake: { auth: { token: 'invalid-token' }, headers: {} },
        disconnect: jest.fn(),
        join: jest.fn(),
      };

      await gateway.handleConnection(mockClient as any);

      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should connect client with valid token and join user + company rooms', async () => {
      const mockPayload = { sub: 'user-123', email: 'test@test.com', role: 'patron' };
      mockJwtService.verify.mockReturnValue(mockPayload);

      const mockClient = {
        id: 'test-client-3',
        handshake: { auth: { token: 'valid-token' }, headers: {} },
        disconnect: jest.fn(),
        join: jest.fn(),
      };

      await gateway.handleConnection(mockClient as any);

      expect(mockClient.disconnect).not.toHaveBeenCalled();
      expect(mockClient.join).toHaveBeenCalledWith('user:user-123');
      expect(mockClient.join).toHaveBeenCalledWith(`company:${DEFAULT_COMPANY_ID}`);
      expect((mockClient as any).user).toEqual({
        id: 'user-123',
        email: 'test@test.com',
        role: 'patron',
        companyId: DEFAULT_COMPANY_ID,
      });
    });

    it('should use companyId from token when present (multi-tenant)', async () => {
      const mockPayload = { sub: 'user-456', email: 'multi@test.com', role: 'patron', companyId: 'company-xyz' };
      mockJwtService.verify.mockReturnValue(mockPayload);

      const mockClient = {
        id: 'test-client-multi',
        handshake: { auth: { token: 'valid-token' }, headers: {} },
        disconnect: jest.fn(),
        join: jest.fn(),
      };

      await gateway.handleConnection(mockClient as any);

      expect(mockClient.disconnect).not.toHaveBeenCalled();
      expect(mockClient.join).toHaveBeenCalledWith('user:user-456');
      expect(mockClient.join).toHaveBeenCalledWith('company:company-xyz');
      expect((mockClient as any).user.companyId).toBe('company-xyz');
    });

    it('should accept token from authorization header', async () => {
      const mockPayload = { sub: 'user-456', email: 'header@test.com', role: 'employe' };
      mockJwtService.verify.mockReturnValue(mockPayload);

      const mockClient = {
        id: 'test-client-4',
        handshake: {
          auth: {},
          headers: { authorization: 'Bearer valid-bearer-token' },
        },
        disconnect: jest.fn(),
        join: jest.fn(),
      };

      await gateway.handleConnection(mockClient as any);

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-bearer-token', { secret: 'test-secret' });
      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('broadcast', () => {
    it('should emit event to all connected clients', () => {
      const payload = { id: 'devis-1', numero: 'DEV-001', clientName: 'Test Client', amount: 1000 };

      gateway.broadcast(WS_EVENTS.DEVIS_CREATED, payload);

      expect(mockServer.emit).toHaveBeenCalledWith(WS_EVENTS.DEVIS_CREATED, payload);
    });
  });

  describe('sendToUser', () => {
    it('should emit event to specific user room', () => {
      const userId = 'user-789';
      const payload = { id: 'facture-1', numero: 'FAC-001', clientName: 'Test Client', amount: 500 };

      gateway.sendToUser(userId, WS_EVENTS.FACTURE_PAID, payload);

      expect(mockServer.to).toHaveBeenCalledWith('user:user-789');
      expect(mockServer.emit).toHaveBeenCalledWith(WS_EVENTS.FACTURE_PAID, payload);
    });
  });

  describe('broadcastToCompany', () => {
    it('should emit event to specific company room', () => {
      const companyId = 'company-abc';
      const payload = { id: 'devis-1', numero: 'DEV-001', clientName: 'Test Client', amount: 1500 };

      gateway.broadcastToCompany(companyId, WS_EVENTS.DEVIS_CREATED, payload);

      expect(mockServer.to).toHaveBeenCalledWith('company:company-abc');
      expect(mockServer.emit).toHaveBeenCalledWith(WS_EVENTS.DEVIS_CREATED, payload);
    });

    it('should isolate events between different companies (multi-tenant)', () => {
      const company1 = 'company-1';
      const company2 = 'company-2';
      const payload1 = { id: 'devis-1', numero: 'DEV-001', clientName: 'Client 1', amount: 1000 };
      const payload2 = { id: 'devis-2', numero: 'DEV-002', clientName: 'Client 2', amount: 2000 };

      // Broadcast to company 1
      gateway.broadcastToCompany(company1, WS_EVENTS.DEVIS_CREATED, payload1);
      expect(mockServer.to).toHaveBeenCalledWith('company:company-1');

      jest.clearAllMocks();

      // Broadcast to company 2 - should not affect company 1
      gateway.broadcastToCompany(company2, WS_EVENTS.DEVIS_CREATED, payload2);
      expect(mockServer.to).toHaveBeenCalledWith('company:company-2');
      expect(mockServer.to).not.toHaveBeenCalledWith('company:company-1');
    });
  });
});
