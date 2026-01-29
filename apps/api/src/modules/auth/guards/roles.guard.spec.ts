import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockExecutionContext = (user: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext);

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);
      const context = mockExecutionContext({ role: 'employe' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has required role (patron)', () => {
      reflector.getAllAndOverride.mockReturnValue(['patron']);
      const context = mockExecutionContext({ role: 'patron' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has required role (employe)', () => {
      reflector.getAllAndOverride.mockReturnValue(['employe']);
      const context = mockExecutionContext({ role: 'employe' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      reflector.getAllAndOverride.mockReturnValue(['patron', 'employe']);
      const context = mockExecutionContext({ role: 'employe' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      reflector.getAllAndOverride.mockReturnValue(['patron']);
      const context = mockExecutionContext({ role: 'employe' });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user role is undefined', () => {
      reflector.getAllAndOverride.mockReturnValue(['patron']);
      const context = mockExecutionContext({ role: undefined });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should call reflector with correct parameters', () => {
      reflector.getAllAndOverride.mockReturnValue(['patron']);
      const context = mockExecutionContext({ role: 'patron' });

      guard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        expect.any(Function),
        expect.any(Function),
      ]);
    });
  });
});
