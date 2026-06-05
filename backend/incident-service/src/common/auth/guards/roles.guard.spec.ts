import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let reflector: Pick<Reflector, 'getAllAndOverride'>;
  let guard: RolesGuard;

  const context = {
    getHandler: () => jest.fn(),
    getClass: () => class TestResolver {},
  } as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new RolesGuard(reflector as Reflector);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when the user has a required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN, Role.OPERATOR]);
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({
        req: {
          user: {
            id: 'user-id',
            email: 'operator@example.com',
            role: Role.OPERATOR,
          },
        },
      }),
    } as GqlExecutionContext);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects access when the user does not have a required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({
        req: {
          user: {
            id: 'user-id',
            email: 'operator@example.com',
            role: Role.OPERATOR,
          },
        },
      }),
    } as GqlExecutionContext);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
