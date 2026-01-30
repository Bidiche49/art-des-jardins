import { JwtService } from '@nestjs/jwt';

const JWT_SECRET = 'test-secret-key-for-tests-only';

export const jwtService = new JwtService({
  secret: JWT_SECRET,
  signOptions: { expiresIn: '1h' },
});

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'patron' | 'employe';
}

export const createTestToken = (payload: JwtPayload): string => {
  return jwtService.sign(payload);
};

export const createPatronToken = (userId: string, email = 'patron@test.com'): string => {
  return createTestToken({
    sub: userId,
    email,
    role: 'patron',
  });
};

export const createEmployeToken = (userId: string, email = 'employe@test.com'): string => {
  return createTestToken({
    sub: userId,
    email,
    role: 'employe',
  });
};

export const createExpiredToken = (payload: JwtPayload): string => {
  const expiredService = new JwtService({
    secret: JWT_SECRET,
    signOptions: { expiresIn: '-1h' },
  });
  return expiredService.sign(payload);
};

export const createInvalidToken = (): string => {
  return 'invalid.token.here';
};

export const createClientToken = (clientId: string, email = 'client@test.com'): string => {
  return jwtService.sign({
    sub: clientId,
    email,
    type: 'client',
  });
};

export const getAuthHeader = (token: string): { Authorization: string } => ({
  Authorization: `Bearer ${token}`,
});

export const JWT_TEST_SECRET = JWT_SECRET;
