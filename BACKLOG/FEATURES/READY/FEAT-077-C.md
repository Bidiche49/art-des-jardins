# FEAT-077-C: Backend - WebAuthn Controller + Integration Auth

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** security, auth, api
**Parent:** FEAT-077
**Depends:** FEAT-077-B
**Date creation:** 2026-02-03

---

## Description

Creer le controller WebAuthn exposant les endpoints REST et integrer l'authentification WebAuthn dans le flow d'auth existant.

## Scope limite

- Controller avec endpoints registration et authentication
- DTOs de validation
- Integration avec AuthService pour generer les tokens JWT
- Guards et decorateurs appropries

## Criteres d'acceptation

- [ ] `WebAuthnController` avec les endpoints:
  - `GET /auth/webauthn/register/options` (auth required)
  - `POST /auth/webauthn/register/verify` (auth required)
  - `GET /auth/webauthn/login/options?email=` (public)
  - `POST /auth/webauthn/login/verify` (public)
  - `GET /auth/webauthn/credentials` (auth required)
  - `DELETE /auth/webauthn/credentials/:id` (auth required)
- [ ] DTOs avec validation class-validator
- [ ] Retourne JWT access token + refresh token apres login WebAuthn
- [ ] Rate limiting sur les endpoints publics
- [ ] Documentation Swagger
- [ ] Tests e2e pour chaque endpoint

## Fichiers concernes

- `apps/api/src/modules/auth/webauthn.controller.ts` (nouveau)
- `apps/api/src/modules/auth/dto/webauthn.dto.ts` (nouveau)
- `apps/api/src/modules/auth/auth.service.ts` (modification)
- `apps/api/src/modules/auth/auth.module.ts` (modification)

## SECTION AUTOMATISATION

**Score:** 85/100

### Raison du score
- Pattern controller NestJS standard
- DTOs simples
- Integration auth existante a verifier

### Prompt d'execution

```
Tu dois creer le controller WebAuthn et l'integrer au module auth.

1. Cree les DTOs dans `apps/api/src/modules/auth/dto/webauthn.dto.ts`:

import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WebAuthnRegisterOptionsDto {
  // Pas de body, juste auth required
}

export class WebAuthnRegisterVerifyDto {
  @ApiProperty()
  @IsString()
  response: string; // JSON stringified RegistrationResponseJSON

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deviceName?: string;
}

export class WebAuthnLoginOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class WebAuthnLoginVerifyDto {
  @ApiProperty()
  @IsString()
  response: string; // JSON stringified AuthenticationResponseJSON
}

2. Cree le controller `apps/api/src/modules/auth/webauthn.controller.ts`:

@Controller('auth/webauthn')
@ApiTags('WebAuthn')
export class WebAuthnController {
  constructor(
    private webAuthnService: WebAuthnService,
    private authService: AuthService,
  ) {}

  @Get('register/options')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRegisterOptions(@CurrentUser() user: User) {
    return this.webAuthnService.startRegistration(user.id);
  }

  @Post('register/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async verifyRegistration(
    @CurrentUser() user: User,
    @Body() dto: WebAuthnRegisterVerifyDto,
  ) {
    const response = JSON.parse(dto.response);
    return this.webAuthnService.finishRegistration(user.id, response, dto.deviceName);
  }

  @Get('login/options')
  @Throttle(10, 60) // 10 requetes par minute
  async getLoginOptions(@Query() dto: WebAuthnLoginOptionsDto) {
    return this.webAuthnService.startAuthentication(dto.email);
  }

  @Post('login/verify')
  @Throttle(5, 60) // 5 tentatives par minute
  async verifyLogin(@Body() dto: WebAuthnLoginVerifyDto) {
    const response = JSON.parse(dto.response);
    const user = await this.webAuthnService.finishAuthentication(response);
    // Generer tokens JWT comme un login normal
    return this.authService.generateTokens(user);
  }

  @Get('credentials')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCredentials(@CurrentUser() user: User) {
    return this.webAuthnService.getUserCredentials(user.id);
  }

  @Delete('credentials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteCredential(
    @CurrentUser() user: User,
    @Param('id') credentialId: string,
  ) {
    return this.webAuthnService.deleteCredential(user.id, credentialId);
  }
}

3. Ajoute le controller et service dans auth.module.ts

4. Cree les tests e2e dans `apps/api/test/webauthn.e2e-spec.ts`:
   - Test register options retourne 401 sans auth
   - Test register options retourne options avec auth
   - Test login options public accessible
   - Test rate limiting fonctionne
   - Test credentials liste les devices de l'user

5. Verifie l'integration avec AuthService.generateTokens()
```

### Criteres de succes automatises

- `pnpm test:e2e` passe
- Documentation Swagger generee
- Endpoints accessibles via curl/Postman
