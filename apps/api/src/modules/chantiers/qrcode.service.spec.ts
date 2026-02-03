import { Test, TestingModule } from '@nestjs/testing';
import { QRCodeService } from './qrcode.service';

describe('QRCodeService', () => {
  let service: QRCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QRCodeService],
    }).compile();

    service = module.get<QRCodeService>(QRCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateChantierQR', () => {
    it('should generate a PNG buffer for a chantier', async () => {
      const chantierId = '123e4567-e89b-12d3-a456-426614174000';
      const buffer = await service.generateChantierQR(chantierId);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      // PNG magic bytes
      expect(buffer.slice(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    });

    it('should accept custom options', async () => {
      const chantierId = '123e4567-e89b-12d3-a456-426614174000';
      const smallBuffer = await service.generateChantierQR(chantierId, { width: 100 });
      const largeBuffer = await service.generateChantierQR(chantierId, { width: 400 });

      expect(largeBuffer.length).toBeGreaterThan(smallBuffer.length);
    });
  });

  describe('generateChantierQRDataURL', () => {
    it('should generate a data URL for a chantier', async () => {
      const chantierId = '123e4567-e89b-12d3-a456-426614174000';
      const dataUrl = await service.generateChantierQRDataURL(chantierId);

      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('generateChantierQRSVG', () => {
    it('should generate an SVG string for a chantier', async () => {
      const chantierId = '123e4567-e89b-12d3-a456-426614174000';
      const svg = await service.generateChantierQRSVG(chantierId);

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });
  });

  describe('parseChantierQR', () => {
    it('should parse a valid chantier QR code', () => {
      const chantierId = '123e4567-e89b-12d3-a456-426614174000';
      const qrData = `aej://chantier/${chantierId}`;

      const result = service.parseChantierQR(qrData);

      expect(result).toBe(chantierId);
    });

    it('should return null for invalid format', () => {
      expect(service.parseChantierQR('invalid')).toBeNull();
      expect(service.parseChantierQR('aej://client/123')).toBeNull();
      expect(service.parseChantierQR('https://example.com')).toBeNull();
    });

    it('should handle complex UUIDs', () => {
      const uuid = 'abc-123-def-456';
      const result = service.parseChantierQR(`aej://chantier/${uuid}`);
      expect(result).toBe(uuid);
    });
  });
});
