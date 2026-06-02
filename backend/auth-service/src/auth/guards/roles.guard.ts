import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthUser } from '../strategies/jwt.strategy';

type AuthenticatedRequest = Request & { user?: AuthUser };

type GraphqlRequestContext = {
  req: AuthenticatedRequest;
};

/**
 * Guard RBAC (Role-Based Access Control).
 * Lit les métadonnées posées par @Roles() et vérifie que
 * l'utilisateur authentifié possède le rôle requis.
 * Doit être utilisé APRÈS GqlAuthGuard (le user doit être dans la requête).
 */
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
        "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.",
      );
    }
    return true;
  }
}
