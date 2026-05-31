import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { GqlThrottlerGuard } from './guards/gql-throttler.guard';

/**
 * AuthModule — module racine de toute la logique d'authentification.
 *
 * Imports :
 *   - PassportModule : infrastructure des stratégies d'authentification
 *   - JwtModule      : signature/vérification des tokens (async pour lire JWT_SECRET depuis .env)
 *
 * Providers :
 *   - AuthService   : logique métier
 *   - AuthResolver  : point d'entrée GraphQL
 *   - JwtStrategy   : stratégie Passport JWT
 *   - RolesGuard    : guard RBAC (déclaré ici pour l'injection de Reflector)
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        // Valeur par défaut alignée sur generateTokenPair() : 15 minutes.
        // generateTokenPair() surcharge toujours cette valeur ; ce default
        // n'est utilisé que si JwtService.sign() est appelé sans options.
        //
        // Note cast : @nestjs/jwt définit expiresIn comme StringValue (type brandé
        // du package ms) et non string ; le cast est inévitable avec cette version.
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as unknown as number },
      }),
    }),
  ],
  // GqlThrottlerGuard doit être dans providers pour que le DI container
  // le connaisse explicitement dans ce module (requis par @UseGuards).
  providers: [AuthService, AuthResolver, JwtStrategy, RolesGuard, GqlThrottlerGuard],
})
export class AuthModule {}
