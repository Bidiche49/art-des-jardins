import { BaseEntity, UUID } from './common';

export type UserRole = 'patron' | 'employe';

export interface User extends BaseEntity {
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role: UserRole;
  actif: boolean;
  derniereConnexion?: Date;
  // Avatar
  avatarUrl?: string;
  // Onboarding
  onboardingCompleted: boolean;
  onboardingStep: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role: UserRole;
}

export interface UpdateUserDto {
  nom?: string;
  prenom?: string;
  telephone?: string;
  role?: UserRole;
  actif?: boolean;
  avatarUrl?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: UUID;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
