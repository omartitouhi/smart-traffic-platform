import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';

/**
 * Guard de rate-limiting adapté pour GraphQL.
 * ThrottlerGuard utilise context.switchToHttp() par défaut,
 * ce qui ne fonctionne pas dans un contexte GraphQL.
 *
 * Surcharge getRequestResponse() pour extraire req/res
 * depuis le contexte GraphQL.
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext): {
    req: Request;
    res: Response;
  } {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: Request }>().req;
    // Dans certaines configs Apollo/Express, req.res peut être absent.
    // On fournit un objet vide en fallback pour éviter une erreur interne
    // du ThrottlerGuard (qui n'utilise res que pour set-cookie côté HTTP).
    const res =
      (req as Request & { res?: Response }).res ?? ({} as unknown as Response);
    return { req, res };
  }
}
