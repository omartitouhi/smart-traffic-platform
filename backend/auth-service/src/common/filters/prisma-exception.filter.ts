import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Prisma } from '../../generated/prisma/client';

type PrismaError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientValidationError;

const SAFE_MESSAGE = 'Une erreur interne est survenue.';

function isKnownRequestError(
  exception: PrismaError,
): exception is Prisma.PrismaClientKnownRequestError {
  return exception instanceof Prisma.PrismaClientKnownRequestError;
}

/**
 * Filtre global qui intercepte toutes les erreurs Prisma non gérées
 * et les remplace par un message générique pour ne pas exposer
 * les détails internes (noms de tables, colonnes, stack traces DB).
 *
 * Les erreurs Prisma explicitement gérées dans les services (ex: P2002 → ConflictException)
 * ne passent jamais par ce filtre — elles sont converties en NestJS exceptions avant.
 *
 * Enregistrement : APP_FILTER dans AppModule (priorité globale).
 */
@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: PrismaError, host: ArgumentsHost): void {
    // Log complet côté serveur pour le debugging
    const detail = isKnownRequestError(exception)
      ? `code=${exception.code}`
      : '';
    this.logger.error(
      `[${exception.constructor.name}] ${exception.message} ${detail}`.trim(),
    );

    // Contexte GraphQL : lever une GraphQLError (Apollo la formate dans errors[])
    if (host.getType<string>() === 'graphql') {
      throw new GraphQLError(SAFE_MESSAGE, {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }

    // Contexte HTTP (fallback si des endpoints REST sont ajoutés)
    const response = host.switchToHttp().getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: SAFE_MESSAGE,
    });
  }
}
