import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

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
    const { user } = ctx.getContext().req;

    if (!requiredRoles.includes(user?.role)) {
      throw new ForbiddenException(
        'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.',
      );
    }
    return true;
  }
}
