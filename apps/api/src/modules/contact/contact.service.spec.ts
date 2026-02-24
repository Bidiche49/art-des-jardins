import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ContactService } from './contact.service';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { StorageService } from '../storage/storage.service';

describe('ContactService', () => {
  let service: ContactService;
  let prisma: PrismaService;
  let mailService: MailService;
  let storageService: StorageService;

  const mockPrisma = {
    contactRequest: {
      create: jest.fn(),
    },
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  const mockStorageService = {
    upload: jest.fn(),
    isConfigured: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      if (key === 'CONTACT_RECIPIENT_EMAIL') return 'test@example.com';
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MailService, useValue: mockMailService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    prisma = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitContact', () => {
    const validDto = {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '06 12 34 56 78',
      city: 'Angers',
      service: 'entretien',
      message: 'Je veux un devis.',
    };

    it('should create contact request and send email', async () => {
      mockPrisma.contactRequest.create.mockResolvedValue({
        id: 'uuid-123',
        ...validDto,
      });
      mockMailService.sendMail.mockResolvedValue(true);

      const result = await service.submitContact(validDto, [], '127.0.0.1', 'Mozilla/5.0');

      expect(result).toEqual({ success: true, id: 'uuid-123' });
      expect(mockPrisma.contactRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Jean Dupont',
          email: 'jean@example.com',
          source: 'website',
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
        }),
      });
      expect(mockMailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: expect.stringContaining('Jean Dupont'),
          documentType: 'contact',
          documentId: 'uuid-123',
        }),
      );
    });

    it('should return success without action when honeypot is filled', async () => {
      const result = await service.submitContact(
        { ...validDto, honeypot: 'spam-value' },
        [],
        '127.0.0.1',
      );

      expect(result).toEqual({ success: true, id: 'ignored' });
      expect(mockPrisma.contactRequest.create).not.toHaveBeenCalled();
      expect(mockMailService.sendMail).not.toHaveBeenCalled();
    });

    it('should upload photos to S3 when files are present', async () => {
      mockStorageService.isConfigured.mockReturnValue(true);
      mockStorageService.upload.mockResolvedValue({
        key: 'contact-photos/test.jpg',
        url: 'https://s3.example.com/contact-photos/test.jpg',
      });
      mockPrisma.contactRequest.create.mockResolvedValue({
        id: 'uuid-456',
        ...validDto,
        photoKeys: ['contact-photos/test.jpg'],
      });
      mockMailService.sendMail.mockResolvedValue(true);

      const mockFile = {
        fieldname: 'photos',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake-image'),
        size: 1024,
      } as Express.Multer.File;

      const result = await service.submitContact(validDto, [mockFile], '127.0.0.1');

      expect(result.success).toBe(true);
      expect(mockStorageService.upload).toHaveBeenCalledWith(mockFile, 'contact-photos');
      expect(mockPrisma.contactRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          photoKeys: ['contact-photos/test.jpg'],
        }),
      });
    });

    it('should work without photos', async () => {
      mockPrisma.contactRequest.create.mockResolvedValue({
        id: 'uuid-789',
        ...validDto,
        photoKeys: [],
      });
      mockMailService.sendMail.mockResolvedValue(true);

      const result = await service.submitContact(validDto);

      expect(result.success).toBe(true);
      expect(mockStorageService.upload).not.toHaveBeenCalled();
      expect(mockPrisma.contactRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          photoKeys: [],
        }),
      });
    });

    it('should not fail if email sending fails', async () => {
      mockPrisma.contactRequest.create.mockResolvedValue({
        id: 'uuid-fail',
        ...validDto,
      });
      mockMailService.sendMail.mockRejectedValue(new Error('SMTP error'));

      const result = await service.submitContact(validDto);

      expect(result).toEqual({ success: true, id: 'uuid-fail' });
    });

    it('should continue if photo upload fails', async () => {
      mockStorageService.isConfigured.mockReturnValue(true);
      mockStorageService.upload.mockRejectedValue(new Error('S3 error'));
      mockPrisma.contactRequest.create.mockResolvedValue({
        id: 'uuid-no-photo',
        ...validDto,
        photoKeys: [],
      });
      mockMailService.sendMail.mockResolvedValue(true);

      const mockFile = {
        fieldname: 'photos',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake'),
        size: 512,
      } as Express.Multer.File;

      const result = await service.submitContact(validDto, [mockFile]);

      expect(result.success).toBe(true);
      expect(mockPrisma.contactRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          photoKeys: [],
        }),
      });
    });
  });
});
