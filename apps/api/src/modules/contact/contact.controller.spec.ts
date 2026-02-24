import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

describe('ContactController', () => {
  let controller: ContactController;
  let service: ContactService;

  const mockContactService = {
    submitContact: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [{ provide: ContactService, useValue: mockContactService }],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /api/v1/contact', () => {
    const dto = {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      message: 'Test message',
    };

    const mockReq = {
      ip: '127.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
      headers: { 'user-agent': 'Jest/1.0' },
    } as any;

    it('should call service and return success', async () => {
      mockContactService.submitContact.mockResolvedValue({
        success: true,
        id: 'uuid-test',
      });

      const result = await controller.submitContact(dto, [], mockReq);

      expect(result).toEqual({ success: true, id: 'uuid-test' });
      expect(mockContactService.submitContact).toHaveBeenCalledWith(
        dto,
        [],
        '127.0.0.1',
        'Jest/1.0',
      );
    });

    it('should pass files to service', async () => {
      mockContactService.submitContact.mockResolvedValue({
        success: true,
        id: 'uuid-files',
      });

      const mockFiles = [
        { originalname: 'photo1.jpg' } as Express.Multer.File,
      ];

      await controller.submitContact(dto, mockFiles, mockReq);

      expect(mockContactService.submitContact).toHaveBeenCalledWith(
        dto,
        mockFiles,
        '127.0.0.1',
        'Jest/1.0',
      );
    });

    it('should extract IP and user-agent from request', async () => {
      mockContactService.submitContact.mockResolvedValue({
        success: true,
        id: 'uuid-ip',
      });

      const reqWithoutIp = {
        ip: undefined,
        socket: { remoteAddress: '192.168.1.1' },
        headers: { 'user-agent': 'Chrome/120' },
      } as any;

      await controller.submitContact(dto, [], reqWithoutIp);

      expect(mockContactService.submitContact).toHaveBeenCalledWith(
        dto,
        [],
        '192.168.1.1',
        'Chrome/120',
      );
    });
  });
});
