import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MailService } from '../mail/mail.service';
import { GeoIpService, GeoLocation } from './geo-ip.service';

export interface DeviceInfo {
  fingerprint: string;
  deviceName: string;
  ip: string;
  userAgent: string;
}

export interface RegisterDeviceResult {
  deviceId: string;
  isNew: boolean;
  device: {
    id: string;
    deviceName: string | null;
    lastIp: string | null;
    lastCity: string | null;
    lastCountry: string | null;
    trustedAt: Date | null;
  };
  geoLocation?: GeoLocation | null;
}

export interface DeviceActionPayload {
  userId: string;
  deviceId: string;
  action: 'trust' | 'revoke';
  iat: number;
  exp: number;
}

@Injectable()
export class DeviceTrackingService {
  private readonly logger = new Logger(DeviceTrackingService.name);
  private readonly deviceActionSecret: string;
  private readonly appUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private auditService: AuditService,
    private mailService: MailService,
    private geoIpService: GeoIpService,
  ) {
    this.deviceActionSecret = this.configService.get<string>('DEVICE_ACTION_SECRET') || 'dev-device-secret-change-in-production';
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  /**
   * Genere un fingerprint unique pour un device
   * Basé sur User-Agent + Accept-Language
   */
  generateFingerprint(userAgent: string, acceptLanguage?: string): string {
    const data = `${userAgent}|${acceptLanguage || 'en'}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Extrait un nom lisible du User-Agent
   */
  parseDeviceName(userAgent: string): string {
    // Patterns courants
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) {
      const match = userAgent.match(/Android[^;]*;\s*([^)]+)/);
      return match ? `Android - ${match[1].trim()}` : 'Android';
    }
    if (userAgent.includes('Windows')) {
      if (userAgent.includes('Edge')) return 'Edge sur Windows';
      if (userAgent.includes('Chrome')) return 'Chrome sur Windows';
      if (userAgent.includes('Firefox')) return 'Firefox sur Windows';
      return 'Windows';
    }
    if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS')) {
      if (userAgent.includes('Chrome')) return 'Chrome sur Mac';
      if (userAgent.includes('Safari')) return 'Safari sur Mac';
      if (userAgent.includes('Firefox')) return 'Firefox sur Mac';
      return 'Mac';
    }
    if (userAgent.includes('Linux')) {
      if (userAgent.includes('Chrome')) return 'Chrome sur Linux';
      if (userAgent.includes('Firefox')) return 'Firefox sur Linux';
      return 'Linux';
    }
    return 'Navigateur inconnu';
  }

  /**
   * Enregistre ou met a jour un device pour un utilisateur
   * Retourne isNew: true si c'est un nouveau device
   */
  async registerDevice(
    userId: string,
    userAgent: string,
    ip: string,
    acceptLanguage?: string,
  ): Promise<RegisterDeviceResult> {
    const fingerprint = this.generateFingerprint(userAgent, acceptLanguage);
    const deviceName = this.parseDeviceName(userAgent);

    // Recupere la geolocalisation
    const geoLocation = await this.geoIpService.lookup(ip);

    // Cherche un device existant
    const existingDevice = await this.prisma.knownDevice.findUnique({
      where: {
        userId_fingerprint: { userId, fingerprint },
      },
    });

    if (existingDevice) {
      // Met a jour le device existant
      const updatedDevice = await this.prisma.knownDevice.update({
        where: { id: existingDevice.id },
        data: {
          lastIp: ip,
          lastCity: geoLocation?.city,
          lastCountry: geoLocation?.country,
          lastSeenAt: new Date(),
        },
      });

      this.logger.debug(`Device connu mis a jour: ${updatedDevice.id} pour user ${userId}`);

      return {
        deviceId: updatedDevice.id,
        isNew: false,
        device: {
          id: updatedDevice.id,
          deviceName: updatedDevice.deviceName,
          lastIp: updatedDevice.lastIp,
          lastCity: updatedDevice.lastCity,
          lastCountry: updatedDevice.lastCountry,
          trustedAt: updatedDevice.trustedAt,
        },
        geoLocation,
      };
    }

    // Cree un nouveau device
    const newDevice = await this.prisma.knownDevice.create({
      data: {
        userId,
        fingerprint,
        deviceName,
        lastIp: ip,
        lastCity: geoLocation?.city,
        lastCountry: geoLocation?.country,
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
      },
    });

    this.logger.log(`Nouveau device detecte: ${newDevice.id} pour user ${userId} (${deviceName})`);

    await this.auditService.log({
      userId,
      action: 'NEW_DEVICE_DETECTED',
      entite: 'auth',
      details: {
        deviceId: newDevice.id,
        deviceName,
        ip,
        city: geoLocation?.city,
        country: geoLocation?.country,
      },
    });

    return {
      deviceId: newDevice.id,
      isNew: true,
      device: {
        id: newDevice.id,
        deviceName: newDevice.deviceName,
        lastIp: newDevice.lastIp,
        lastCity: newDevice.lastCity,
        lastCountry: newDevice.lastCountry,
        trustedAt: newDevice.trustedAt,
      },
      geoLocation,
    };
  }

  /**
   * Genere un token JWT pour les actions email (trust/revoke)
   */
  generateActionToken(userId: string, deviceId: string, action: 'trust' | 'revoke'): string {
    const payload: Omit<DeviceActionPayload, 'iat' | 'exp'> = {
      userId,
      deviceId,
      action,
    };

    return this.jwtService.sign(payload, {
      secret: this.deviceActionSecret,
      expiresIn: '24h',
    });
  }

  /**
   * Valide un token d'action et retourne le payload
   */
  validateActionToken(token: string): DeviceActionPayload | null {
    try {
      const payload = this.jwtService.verify<DeviceActionPayload>(token, {
        secret: this.deviceActionSecret,
      });
      return payload;
    } catch {
      this.logger.warn('Token d\'action invalide ou expire');
      return null;
    }
  }

  /**
   * Envoie l'email d'alerte pour un nouveau device
   */
  async sendNewDeviceAlert(
    userId: string,
    deviceId: string,
    deviceName: string,
    ip: string,
    geoLocation: GeoLocation | null,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, nom: true, prenom: true },
    });

    if (!user) {
      this.logger.error(`User ${userId} non trouve pour envoi alerte device`);
      return false;
    }

    const trustToken = this.generateActionToken(userId, deviceId, 'trust');
    const revokeToken = this.generateActionToken(userId, deviceId, 'revoke');

    const trustUrl = `${this.appUrl}/auth/device/trust/${trustToken}`;
    const revokeUrl = `${this.appUrl}/auth/device/revoke/${revokeToken}`;

    const userName = `${user.prenom} ${user.nom}`;
    const city = geoLocation?.city || 'Localisation inconnue';
    const country = geoLocation?.country || '';
    const locationStr = country ? `${city}, ${country}` : city;
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = this.buildNewLoginAlertEmail({
      userName,
      deviceName,
      ip,
      location: locationStr,
      date: dateStr,
      trustUrl,
      revokeUrl,
    });

    return this.mailService.sendMail({
      to: user.email,
      subject: 'Nouvelle connexion detectee - Art & Jardin',
      html,
      templateName: 'new-login-alert',
      skipBcc: true, // Pas de copie pour les alertes securite
    });
  }

  /**
   * Construit le HTML de l'email d'alerte nouveau device
   */
  private buildNewLoginAlertEmail(params: {
    userName: string;
    deviceName: string;
    ip: string;
    location: string;
    date: string;
    trustUrl: string;
    revokeUrl: string;
  }): string {
    const { userName, deviceName, ip, location, date, trustUrl, revokeUrl } = params;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: #d9534f; color: white; padding: 25px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; }
    .header .icon { font-size: 48px; margin-bottom: 10px; }
    .content { padding: 30px; }
    .info-box { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #666; width: 120px; flex-shrink: 0; }
    .info-value { font-weight: bold; }
    .buttons { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 14px 28px; margin: 8px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; }
    .btn-success { background: #28a745; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin: 20px 0; color: #856404; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; background: #f8f9fa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="icon">&#9888;</div>
        <h1>Nouvelle connexion detectee</h1>
      </div>
      <div class="content">
        <p>Bonjour ${userName},</p>
        <p>Une connexion a votre compte a ete detectee depuis un nouvel appareil :</p>

        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Appareil</span>
            <span class="info-value">${deviceName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Adresse IP</span>
            <span class="info-value">${ip}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Localisation</span>
            <span class="info-value">${location}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date</span>
            <span class="info-value">${date}</span>
          </div>
        </div>

        <p><strong>C'etait vous ?</strong></p>

        <div class="buttons">
          <a href="${trustUrl}" class="btn btn-success">Oui, c'etait moi</a>
          <a href="${revokeUrl}" class="btn btn-danger">Non, ce n'etait pas moi</a>
        </div>

        <div class="warning">
          <strong>&#9888; Si vous n'etes pas a l'origine de cette connexion</strong>, cliquez sur "Non, ce n'etait pas moi" pour securiser immediatement votre compte. Toutes les sessions seront deconnectees.
        </div>

        <p style="font-size: 13px; color: #666;">
          Ces liens sont valables pendant 24 heures. Si vous n'effectuez aucune action, le device restera non verifie mais la connexion restera active.
        </p>
      </div>
      <div class="footer">
        <p>Art & Jardin - Paysagiste a Angers</p>
        <p>Cet email a ete envoye automatiquement pour votre securite.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Marque un device comme trusted
   */
  async trustDevice(deviceId: string, userId: string): Promise<boolean> {
    const device = await this.prisma.knownDevice.findFirst({
      where: { id: deviceId, userId },
    });

    if (!device) {
      this.logger.warn(`Device ${deviceId} non trouve pour user ${userId}`);
      return false;
    }

    await this.prisma.knownDevice.update({
      where: { id: deviceId },
      data: { trustedAt: new Date() },
    });

    await this.auditService.log({
      userId,
      action: 'DEVICE_TRUSTED',
      entite: 'auth',
      details: { deviceId, deviceName: device.deviceName },
    });

    this.logger.log(`Device ${deviceId} marque comme trusted pour user ${userId}`);
    return true;
  }

  /**
   * Revoque toutes les sessions de l'utilisateur et supprime le device non trusted
   */
  async revokeDeviceAndSessions(deviceId: string, userId: string): Promise<boolean> {
    const device = await this.prisma.knownDevice.findFirst({
      where: { id: deviceId, userId },
    });

    if (!device) {
      this.logger.warn(`Device ${deviceId} non trouve pour user ${userId}`);
      return false;
    }

    // Transaction: supprimer tous les refresh tokens et le device
    await this.prisma.$transaction(async (tx) => {
      // Supprimer tous les refresh tokens de l'utilisateur
      await tx.refreshToken.deleteMany({
        where: { userId },
      });

      // Supprimer le device suspect
      await tx.knownDevice.delete({
        where: { id: deviceId },
      });
    });

    await this.auditService.log({
      userId,
      action: 'DEVICE_REVOKED_ALL_SESSIONS',
      entite: 'auth',
      details: {
        deviceId,
        deviceName: device.deviceName,
        reason: 'user_reported_suspicious',
      },
    });

    this.logger.warn(`Device ${deviceId} revoque et toutes sessions supprimees pour user ${userId}`);
    return true;
  }

  /**
   * Liste tous les devices d'un utilisateur
   */
  async getUserDevices(userId: string) {
    return this.prisma.knownDevice.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' },
      select: {
        id: true,
        deviceName: true,
        lastIp: true,
        lastCity: true,
        lastCountry: true,
        firstSeenAt: true,
        lastSeenAt: true,
        trustedAt: true,
      },
    });
  }

  /**
   * Supprime un device specifique
   */
  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    const device = await this.prisma.knownDevice.findFirst({
      where: { id: deviceId, userId },
    });

    if (!device) {
      return false;
    }

    // Revoquer les refresh tokens lies a ce device
    await this.prisma.refreshToken.deleteMany({
      where: { deviceId },
    });

    await this.prisma.knownDevice.delete({
      where: { id: deviceId },
    });

    await this.auditService.log({
      userId,
      action: 'DEVICE_DELETED',
      entite: 'auth',
      details: { deviceId, deviceName: device.deviceName },
    });

    return true;
  }
}
