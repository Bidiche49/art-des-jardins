import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';

interface ClientJwtPayload {
  sub: string;
  email: string;
  type: string;
}

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy, 'client-jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
    });
  }

  async validate(payload: ClientJwtPayload) {
    if (payload.type !== 'client') {
      throw new UnauthorizedException('Token invalide pour le portail client');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: payload.sub },
    });

    if (!client) {
      throw new UnauthorizedException('Client non trouvé');
    }

    return { id: client.id, email: client.email };
  }
}
