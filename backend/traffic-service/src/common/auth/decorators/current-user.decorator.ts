import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import type { AuthUser } from '../strategies/jwt.strategy';

type AuthenticatedRequest = Request & { user?: AuthUser };

type GraphqlRequestContext = {
  req: AuthenticatedRequest;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GraphqlRequestContext>().req.user;
  },
);
