import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import type { AuthUser } from '../strategies/jwt.strategy';

type AuthenticatedRequest = Request & { user?: AuthUser };

type GraphqlRequestContext = {
  req: AuthenticatedRequest;
};

/**
 * Décorateur de paramètre @CurrentUser().
 * Extrait l'utilisateur authentifié depuis le contexte GraphQL
 * (injecté par JwtStrategy après validation du token).
 *
 * Usage : @CurrentUser() user: UserEntity
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GraphqlRequestContext>().req.user;
  },
);
