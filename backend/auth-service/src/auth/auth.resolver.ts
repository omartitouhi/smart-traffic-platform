import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthPayloadEntity } from './entities/auth-payload.entity';
import { UserEntity } from './entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlThrottlerGuard } from './guards/gql-throttler.guard';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

/**
 * AuthResolver — point d'entrée GraphQL du module Auth.
 *
 * Mutations publiques (sans guard) :
 *   - register : crée un compte et retourne un JWT
 *   - login    : authentifie et retourne un JWT
 *
 * Queries protégées :
 *   - me       : retourne le profil de l'utilisateur connecté (JWT requis)
 *   - users    : retourne tous les utilisateurs (ADMIN uniquement)
 */
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * register — 5 tentatives / 60 secondes par IP
   * Limite stricte car la création de compte est coûteuse (bcrypt 10 rounds).
   */
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Mutation(() => AuthPayloadEntity)
  register(@Args('input') input: RegisterInput): Promise<AuthPayloadEntity> {
    return this.authService.register(input);
  }

  /**
   * login — 10 tentatives / 60 secondes par IP
   * Limite stricte pour bloquer les attaques par force brute.
   */
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Mutation(() => AuthPayloadEntity)
  login(@Args('input') input: LoginInput): Promise<AuthPayloadEntity> {
    return this.authService.login(input);
  }

  /**
   * refreshToken — 20 tentatives / 60 secondes par IP
   * Légèrement moins strict que login (token préexistant requis).
   * Invalide l'ancien refresh token et en émet un nouveau (rotation).
   */
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  @Mutation(() => AuthPayloadEntity)
  refreshToken(@Args('input') input: RefreshTokenInput): Promise<AuthPayloadEntity> {
    return this.authService.refreshTokens(input);
  }

  /**
   * logout — 30 tentatives / 60 secondes par IP.
   * Public (pas d'access token requis) : l'utilisateur peut se déconnecter
   * même si son access token est déjà expiré.
   * Rate limit pour éviter les appels en boucle sur token invalide (graceful true).
   */
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  @Mutation(() => Boolean)
  logout(@Args('input') input: RefreshTokenInput): Promise<boolean> {
    return this.authService.logout(input);
  }

  /**
   * Retourne le profil complet de l'utilisateur connecté.
   * Requiert un Bearer Token valide dans le header Authorization.
   */
  @UseGuards(GqlAuthGuard)
  @Query(() => UserEntity)
  me(@CurrentUser() currentUser: { id: string }): Promise<UserEntity> {
    return this.authService.getMe(currentUser.id);
  }

  /**
   * Retourne les utilisateurs paginés.
   * Requiert un Bearer Token valide + rôle ADMIN.
   * Double garde : GqlAuthGuard vérifie le token, RolesGuard vérifie le rôle.
   *
   * @param take  Nombre de résultats (1–100, défaut 50)
   * @param skip  Décalage pour la pagination (défaut 0)
   */
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [UserEntity])
  users(
    @Args('take', { type: () => Int, nullable: true, defaultValue: 50 }) take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
  ): Promise<UserEntity[]> {
    return this.authService.getUsers(take, skip);
  }
}
