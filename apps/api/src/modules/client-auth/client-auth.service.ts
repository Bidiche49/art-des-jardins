import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ClientAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async requestMagicLink(email: string): Promise<{ message: string }> {
    const client = await this.prisma.client.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!client) {
      return { message: 'Si cette adresse existe, un email a été envoyé' };
    }

    const recentTokens = await this.prisma.clientAuthToken.count({
      where: {
        clientId: client.id,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });

    if (recentTokens >= 3) {
      throw new BadRequestException('Trop de demandes. Réessayez dans 1 heure.');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.clientAuthToken.create({
      data: {
        clientId: client.id,
        token,
        expiresAt,
      },
    });

    const portalUrl = this.configService.get('PORTAL_URL') || 'http://localhost:3001';
    const magicLink = `${portalUrl}/client/verify/${token}`;

    const clientName = client.prenom ? `${client.prenom} ${client.nom}` : client.nom;

    await this.mailService.sendMail({
      to: client.email,
      subject: 'Connexion à votre espace client - Art & Jardin',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d5a27; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; background: #2d5a27; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .warning { font-size: 12px; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Art & Jardin</h1>
    </div>
    <div class="content">
      <p>Bonjour ${clientName},</p>
      <p>Vous avez demandé à accéder à votre espace client.</p>
      <p>Cliquez sur le bouton ci-dessous pour vous connecter :</p>
      <p style="text-align: center;">
        <a href="${magicLink}" class="button" style="color: white;">Accéder à mon espace</a>
      </p>
      <p class="warning">
        Ce lien est valable 15 minutes et ne peut être utilisé qu'une seule fois.<br>
        Si vous n'avez pas demandé cet accès, ignorez cet email.
      </p>
    </div>
    <div class="footer">
      <p>Art & Jardin - Paysagiste à Angers</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { message: 'Si cette adresse existe, un email a été envoyé' };
  }

  async verifyToken(token: string) {
    const authToken = await this.prisma.clientAuthToken.findUnique({
      where: { token },
      include: { client: true },
    });

    if (!authToken) {
      throw new UnauthorizedException('Lien invalide ou expiré');
    }

    if (authToken.usedAt) {
      throw new UnauthorizedException('Ce lien a déjà été utilisé');
    }

    if (authToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Ce lien a expiré');
    }

    await this.prisma.clientAuthToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() },
    });

    const client = authToken.client;
    const payload = {
      sub: client.id,
      email: client.email,
      type: 'client',
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      client: {
        id: client.id,
        email: client.email,
        nom: client.nom,
        prenom: client.prenom,
        type: client.type,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      if (payload.type !== 'client') {
        throw new UnauthorizedException('Token invalide');
      }

      const client = await this.prisma.client.findUnique({
        where: { id: payload.sub },
      });

      if (!client) {
        throw new UnauthorizedException('Client non trouvé');
      }

      const newPayload = {
        sub: client.id,
        email: client.email,
        type: 'client',
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  async getClientFromToken(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new UnauthorizedException('Client non trouvé');
    }

    return {
      id: client.id,
      email: client.email,
      nom: client.nom,
      prenom: client.prenom,
      type: client.type,
    };
  }
}
