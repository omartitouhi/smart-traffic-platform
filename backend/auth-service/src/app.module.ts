import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER } from '@nestjs/core';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

const isProd = process.env.NODE_ENV === 'production';

/**
 * AppModule — module racine de l'application.
 *
 * GraphQLModule : schéma généré automatiquement (code-first)
 *   - autoSchemaFile : chemin de génération du schema.gql
 *   - context        : injecte req dans le contexte GraphQL (requis par les guards)
 *   - introspection  : désactivée en production (n'expose pas le schéma)
 *   - playground     : désactivé en production
 *
 * ThrottlerModule : rate-limiting global (seuils par défaut généreux)
 *   Les mutations sensibles surchargeront ces seuils via @Throttle()
 *
 * PrismaModule : global, fournit PrismaService à toute l'application
 * AuthModule   : module d'authentification complet
 */
@Module({
  // Filtre global : intercepte les erreurs Prisma non gérées et les masque
  // (ne jamais exposer les détails internes DB dans les réponses GraphQL).
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
  imports: [
    ThrottlerModule.forRoot([
      {
        // Seuil global par défaut : 100 requêtes / 60 secondes
        ttl: 60_000,
        limit: 100,
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: Request }) => ({ req }),
      // Désactiver l'introspection et le playground en production
      introspection: !isProd,
      playground: !isProd,
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
