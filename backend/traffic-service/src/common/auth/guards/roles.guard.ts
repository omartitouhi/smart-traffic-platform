import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { Role } from '../../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthUser } from '../strategies/jwt.strategy';

type AuthenticatedRequest = Request & { user?: AuthUser };

type GraphqlRequestContext = {
  req: AuthenticatedRequest;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext<GraphqlRequestContext>().req;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits necessaires pour acceder a cette ressource.",
      );
    }

    return true;
  }
}
