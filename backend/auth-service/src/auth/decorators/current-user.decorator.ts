import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

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
    return ctx.getContext().req.user;
  },
);
