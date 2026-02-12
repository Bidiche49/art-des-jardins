import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';
import { PrismaService } from '../../database/prisma.service';

const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface ChallengeData {
  challenge: string;
  expiresAt: number;
  userId?: string;
  rpID: string;
  origin: string;
}

@Injectable()
export class WebAuthnService {
  private rpName: string;
  private rpID: string;
  private origin: string;
  private isDev: boolean;

  // In-memory cache for challenges (in production, use Redis)
  private challengeCache: Map<string, ChallengeData> = new Map();

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.rpName = this.config.get('WEBAUTHN_RP_NAME', 'Art & Jardin');
    this.rpID = this.config.get('WEBAUTHN_RP_ID', 'localhost');
    this.origin = this.config.get('WEBAUTHN_ORIGIN', 'http://localhost:3000');
    this.isDev = this.config.get('NODE_ENV', 'development') !== 'production';
  }

  /**
   * Resolve rpID and origin from the request Origin/Referer header in dev mode.
   * In production, use the configured values.
   */
  private resolveRpConfig(requestOrigin?: string): { rpID: string; origin: string } {
    if (!this.isDev || !requestOrigin) {
      return { rpID: this.rpID, origin: this.origin };
    }
    try {
      const url = new URL(requestOrigin);
      // Extract just the origin (protocol + host + port), strip any path
      const cleanOrigin = url.origin;
      return { rpID: url.hostname, origin: cleanOrigin };
    } catch {
      return { rpID: this.rpID, origin: this.origin };
    }
  }

  /**
   * Start WebAuthn registration - generates options for the client
   */
  async startRegistration(userId: string, requestOrigin?: string): Promise<ReturnType<typeof generateRegistrationOptions>> {
    const { rpID, origin } = this.resolveRpConfig(requestOrigin);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nom: true, prenom: true, webAuthnCredentials: true },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Exclude existing credentials from registration
    const excludeCredentials = user.webAuthnCredentials.map((cred) => ({
      id: cred.credentialId,
      transports: cred.transports as AuthenticatorTransportFuture[],
    }));

    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID,
      userName: user.email,
      userDisplayName: `${user.prenom} ${user.nom}`,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    // Store challenge in cache with rpID/origin for verification
    this.setChallenge(`reg:${userId}`, options.challenge, userId, rpID, origin);

    return options;
  }

  /**
   * Complete WebAuthn registration - verifies and stores the credential
   */
  async finishRegistration(
    userId: string,
    response: RegistrationResponseJSON,
    deviceName?: string,
  ): Promise<{ success: boolean; credentialId: string }> {
    const challengeData = this.getChallenge(`reg:${userId}`);

    if (!challengeData || challengeData.expiresAt < Date.now()) {
      throw new BadRequestException('Challenge expiré ou invalide. Recommencez l\'enregistrement.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: challengeData.challenge,
        expectedOrigin: challengeData.origin,
        expectedRPID: challengeData.rpID,
      });
    } catch (error) {
      throw new BadRequestException(`Vérification échouée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    if (!verification.verified || !verification.registrationInfo) {
      throw new BadRequestException('Vérification de l\'enregistrement échouée');
    }

    const { credential, credentialDeviceType } = verification.registrationInfo;

    // Store credential in database
    await this.prisma.webAuthnCredential.create({
      data: {
        userId,
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString('base64'),
        counter: credential.counter,
        deviceName: deviceName || 'Appareil inconnu',
        deviceType: credentialDeviceType,
        transports: response.response.transports || [],
      },
    });

    // Clear challenge
    this.deleteChallenge(`reg:${userId}`);

    return { success: true, credentialId: credential.id };
  }

  /**
   * Start WebAuthn authentication - generates options for the client
   * If email is provided, only allow credentials for that user
   */
  async startAuthentication(email?: string, requestOrigin?: string): Promise<ReturnType<typeof generateAuthenticationOptions>> {
    const { rpID, origin } = this.resolveRpConfig(requestOrigin);

    let allowCredentials: { id: string; transports?: AuthenticatorTransportFuture[] }[] | undefined;
    let userId: string | undefined;

    if (email) {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, webAuthnCredentials: true },
      });

      if (!user || user.webAuthnCredentials.length === 0) {
        throw new BadRequestException('Aucun appareil biométrique enregistré pour cet utilisateur');
      }

      userId = user.id;
      allowCredentials = user.webAuthnCredentials.map((cred) => ({
        id: cred.credentialId,
        transports: cred.transports as AuthenticatorTransportFuture[],
      }));
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: 'preferred',
    });

    // Store challenge in cache with rpID/origin for verification
    this.setChallenge(`auth:${options.challenge}`, options.challenge, userId, rpID, origin);

    return options;
  }

  /**
   * Complete WebAuthn authentication - verifies and returns the user
   */
  async finishAuthentication(
    response: AuthenticationResponseJSON,
  ): Promise<{ success: boolean; userId: string }> {
    // Find the credential in database
    const credential = await this.prisma.webAuthnCredential.findUnique({
      where: { credentialId: response.id },
      include: { user: { select: { id: true, email: true, actif: true } } },
    });

    if (!credential) {
      throw new UnauthorizedException('Credential non reconnu');
    }

    if (!credential.user.actif) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Find the challenge
    const challengeData = this.getChallenge(`auth:${response.rawId ? Buffer.from(response.rawId).toString('base64url') : response.id}`);

    // Try to find challenge by iterating through cache (for cases where we don't know the challenge beforehand)
    let foundChallenge: ChallengeData | undefined;
    for (const [key, data] of this.challengeCache.entries()) {
      if (key.startsWith('auth:') && data.expiresAt > Date.now()) {
        // If userId was stored and doesn't match, skip
        if (data.userId && data.userId !== credential.userId) {
          continue;
        }
        foundChallenge = data;
        break;
      }
    }

    if (!foundChallenge) {
      throw new BadRequestException('Challenge expiré ou invalide. Recommencez l\'authentification.');
    }

    let verification: VerifiedAuthenticationResponse;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: foundChallenge.challenge,
        expectedOrigin: foundChallenge.origin,
        expectedRPID: foundChallenge.rpID,
        credential: {
          id: credential.credentialId,
          publicKey: Buffer.from(credential.publicKey, 'base64'),
          counter: credential.counter,
          transports: credential.transports as AuthenticatorTransportFuture[],
        },
      });
    } catch (error) {
      throw new UnauthorizedException(`Authentification échouée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    if (!verification.verified) {
      throw new UnauthorizedException('Vérification de l\'authentification échouée');
    }

    // Update counter and lastUsedAt
    await this.prisma.webAuthnCredential.update({
      where: { id: credential.id },
      data: {
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      },
    });

    // Clear used challenges
    this.cleanupExpiredChallenges();

    return { success: true, userId: credential.userId };
  }

  /**
   * Get all credentials for a user
   */
  async getUserCredentials(userId: string): Promise<{
    id: string;
    credentialId: string;
    deviceName: string | null;
    deviceType: string | null;
    lastUsedAt: Date | null;
    createdAt: Date;
  }[]> {
    const credentials = await this.prisma.webAuthnCredential.findMany({
      where: { userId },
      select: {
        id: true,
        credentialId: true,
        deviceName: true,
        deviceType: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return credentials;
  }

  /**
   * Delete a specific credential
   */
  async deleteCredential(userId: string, credentialId: string): Promise<{ success: boolean }> {
    const credential = await this.prisma.webAuthnCredential.findFirst({
      where: {
        id: credentialId,
        userId,
      },
    });

    if (!credential) {
      throw new BadRequestException('Credential non trouvé ou non autorisé');
    }

    await this.prisma.webAuthnCredential.delete({
      where: { id: credentialId },
    });

    return { success: true };
  }

  /**
   * Revoke all credentials for a user
   */
  async revokeAllCredentials(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.webAuthnCredential.deleteMany({
      where: { userId },
    });

    return { count: result.count };
  }

  // ============================================
  // Challenge cache management (in-memory)
  // In production, replace with Redis
  // ============================================

  private setChallenge(key: string, challenge: string, userId?: string, rpID?: string, origin?: string): void {
    this.challengeCache.set(key, {
      challenge,
      expiresAt: Date.now() + CHALLENGE_TTL_MS,
      userId,
      rpID: rpID || this.rpID,
      origin: origin || this.origin,
    });
  }

  private getChallenge(key: string): ChallengeData | undefined {
    const data = this.challengeCache.get(key);
    if (data && data.expiresAt > Date.now()) {
      return data;
    }
    this.challengeCache.delete(key);
    return undefined;
  }

  private deleteChallenge(key: string): void {
    this.challengeCache.delete(key);
  }

  private cleanupExpiredChallenges(): void {
    const now = Date.now();
    for (const [key, data] of this.challengeCache.entries()) {
      if (data.expiresAt < now) {
        this.challengeCache.delete(key);
      }
    }
  }
}
