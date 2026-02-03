import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

@Injectable()
export class QRCodeService {
  private readonly defaultOptions: QRCodeOptions = {
    width: 200,
    margin: 2,
    errorCorrectionLevel: 'M',
  };

  /**
   * Genere un QR code pour un chantier
   * Format: aej://chantier/{uuid}
   */
  async generateChantierQR(chantierId: string, options?: QRCodeOptions): Promise<Buffer> {
    const data = `aej://chantier/${chantierId}`;
    return this.generateQR(data, options);
  }

  /**
   * Genere un QR code au format Data URL (base64)
   */
  async generateChantierQRDataURL(chantierId: string, options?: QRCodeOptions): Promise<string> {
    const data = `aej://chantier/${chantierId}`;
    return this.generateQRDataURL(data, options);
  }

  /**
   * Genere un QR code au format SVG (string)
   */
  async generateChantierQRSVG(chantierId: string, options?: QRCodeOptions): Promise<string> {
    const data = `aej://chantier/${chantierId}`;
    return this.generateQRSVG(data, options);
  }

  /**
   * Genere un QR code generique au format Buffer (PNG)
   */
  private async generateQR(data: string, options?: QRCodeOptions): Promise<Buffer> {
    const opts = { ...this.defaultOptions, ...options };
    return QRCode.toBuffer(data, {
      errorCorrectionLevel: opts.errorCorrectionLevel,
      width: opts.width,
      margin: opts.margin,
      type: 'png',
    });
  }

  /**
   * Genere un QR code au format Data URL
   */
  private async generateQRDataURL(data: string, options?: QRCodeOptions): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    return QRCode.toDataURL(data, {
      errorCorrectionLevel: opts.errorCorrectionLevel,
      width: opts.width,
      margin: opts.margin,
    });
  }

  /**
   * Genere un QR code au format SVG
   */
  private async generateQRSVG(data: string, options?: QRCodeOptions): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    return QRCode.toString(data, {
      type: 'svg',
      errorCorrectionLevel: opts.errorCorrectionLevel,
      width: opts.width,
      margin: opts.margin,
    });
  }

  /**
   * Parse une URL de QR code pour extraire l'ID du chantier
   */
  parseChantierQR(qrData: string): string | null {
    const match = qrData.match(/^aej:\/\/chantier\/(.+)$/);
    return match ? match[1] : null;
  }
}
