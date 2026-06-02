import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import type { AuthUser } from '../strategies/jwt.strategy';

type AuthenticatedRequest = Request & { user?: AuthUser };

type GraphqlRequestContext = {
  req: AuthenticatedRequest;
};

/**
 * Guard JWT adapté pour GraphQL.
 * Surcharge getRequest() car le contexte GraphQL n'est pas
 * le même que le contexte HTTP standard de Express.
 * Protège toutes les mutations/queries qui requièrent un token valide.
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): AuthenticatedRequest {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GraphqlRequestContext>().req;
  }
}
