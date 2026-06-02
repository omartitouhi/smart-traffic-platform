import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../generated/prisma/client';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { AuthPayloadEntity } from './entities/auth-payload.entity';
import { UserEntity } from './entities/user.entity';
import { Role } from '../common/enums/role.enum';

const SALT_ROUNDS = 10;
// Refresh tokens sont longs (JWT) → SHA-256 avant bcrypt pour éviter la
// troncature silencieuse à 72 octets propre à bcrypt.
const REFRESH_SALT_ROUNDS = 8;

/**
 * Réduit un refresh token à 64 caractères hex fixes via SHA-256.
 * Résout le problème de truncation bcrypt à 72 octets.
 */
function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JwtAccessPayload {
  sub: string;
  email: string;
  role: User['role'];
}

interface JwtRefreshPayload {
  sub: string;
}

interface JwtDecodedRefreshPayload extends JwtRefreshPayload {
  exp: number;
}

function isPrismaErrorWithCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  );
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    // Fail-fast : les deux secrets doivent être présents au démarrage
    if (!process.env.JWT_SECRET) {
      throw new InternalServerErrorException(
        "JWT_SECRET est absent des variables d'environnement.",
      );
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new InternalServerErrorException(
        "JWT_REFRESH_SECRET est absent des variables d'environnement.",
      );
    }

    // Valider les durées JWT au démarrage.
    // Formats acceptés : nombre seul (secondes) ou nombre + unité s/m/h/d.
    // Ex valides : 3600, 15m, 1h, 7d. Ex invalide : abc123 → erreur immédiate.
    // Formats acceptés : secondes brutes (3600), ou nombre + unité.
    // Unités : s(econdes), m(inutes), h(eures), d(ays), w(eeks), ms (millisecondes)
    const durationRegex = /^\d+([smhdw]|ms)$|^\d+$/;
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '15m';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
    if (!durationRegex.test(expiresIn)) {
      throw new InternalServerErrorException(
        `JWT_EXPIRES_IN invalide: "${expiresIn}". Exemples valides: 15m, 1h, 3600`,
      );
    }
    if (!durationRegex.test(refreshExpiresIn)) {
      throw new InternalServerErrorException(
        `JWT_REFRESH_EXPIRES_IN invalide: "${refreshExpiresIn}". Exemples valides: 7d, 168h`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers privés
  // ─────────────────────────────────────────────────────────────────────────

  /** Mappe un User Prisma vers UserEntity (exclut password et tokens). */
  private toUserEntity(user: User): UserEntity {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as Role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Génère une paire access + refresh token.
   *
   * Secrets distincts :
   *   - JWT_SECRET        → access token (durée courte, ex: 15m)
   *   - JWT_REFRESH_SECRET → refresh token (durée longue, ex: 7j)
   */
  private generateTokenPair(user: User): TokenPair {
    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshPayload: JwtRefreshPayload = { sub: user.id };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: process.env.JWT_SECRET,
      // La valeur est validée en format durée dans le constructeur.
      // Cast inévitable : @nestjs/jwt type expiresIn comme StringValue
      // (type brandé du package ms), pas comme string.
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as unknown as number,
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
        '7d') as unknown as number,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Hache et persiste le refresh token.
   * L'expiry est extrait du payload JWT pour rester en parfaite synchronisation.   *
   * Note — session unique par utilisateur (design intentionnel) :
   * Chaque appel écrase le hash précédent. Un second login depuis un autre
   * appareil invalide silencieusement la session du premier. Pour du multi-sessions,
   * remplacer ce champ par une table dédiée RefreshToken (one-to-many avec User).   */
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    // SHA-256 avant bcrypt → évite la troncature silencieuse à 72 octets
    const hash = await bcrypt.hash(sha256(refreshToken), REFRESH_SALT_ROUNDS);
    // Lire l'expiry directement depuis le JWT signé (champ "exp" en secondes Unix)
    const decoded =
      this.jwtService.decode<JwtDecodedRefreshPayload>(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash, refreshTokenExpiresAt: expiresAt },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Mutations publiques
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Enregistre un nouvel utilisateur et retourne une paire de tokens.
   */
  async register(input: RegisterInput): Promise<AuthPayloadEntity> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    let user: User;
    try {
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });
    } catch (e) {
      // P2002 = unique constraint violation → email déjà utilisé
      // Remplace la vérification pré-create non-atomique (race condition TOCTOU)
      if (isPrismaErrorWithCode(e) && e.code === 'P2002') {
        throw new ConflictException('Un compte avec cet email existe déjà.');
      }
      throw e;
    }

    const { accessToken, refreshToken } = this.generateTokenPair(user);
    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user: this.toUserEntity(user) };
  }

  /**
   * Authentifie un utilisateur et retourne une paire de tokens.
   *
   * Sécurité :
   *   - Anti-énumération : même message d'erreur pour email inconnu et mauvais mot de passe
   *   - bcrypt.compare est timing-safe
   */
  async login(input: LoginInput): Promise<AuthPayloadEntity> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    const { accessToken, refreshToken } = this.generateTokenPair(user);
    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user: this.toUserEntity(user) };
  }

  /**
   * Rafraîchit la paire de tokens (rotation).
   *
   * Pipeline de validation (chaque étape est un verrou sécurité) :
   *   1. Vérifie la signature JWT avec JWT_REFRESH_SECRET
   *   2. Récupère l'utilisateur et vérifie qu'une session active existe
   *   3. Vérifie l'expiry stocké en base (double-check indépendant du JWT)
   *   4. Compare le hash bcrypt (timing-safe) → détecte le token reuse
   *   5. Si hash invalide → révocation totale (defence against token reuse attack)
   *   6. Génère et stocke une nouvelle paire (rotation)
   */
  async refreshTokens(input: RefreshTokenInput): Promise<AuthPayloadEntity> {
    // 1. Vérifier signature + expiry JWT
    let payload: JwtRefreshPayload;
    try {
      payload = this.jwtService.verify<JwtRefreshPayload>(input.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré.');
    }

    // 2. Récupérer l'utilisateur et vérifier qu'il a une session active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token invalide ou expiré.');
    }

    // 3. Double-check expiry en base (indépendant du JWT)
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: null, refreshTokenExpiresAt: null },
      });
      throw new UnauthorizedException('Refresh token invalide ou expiré.');
    }

    // 4 & 5. Comparer le hash — si invalide → token reuse attack → révocation totale
    // SHA-256 avant compare pour correspondre au stockage (même pré-hash)
    const isValid = await bcrypt.compare(
      sha256(input.refreshToken),
      user.refreshTokenHash,
    );
    if (!isValid) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: null, refreshTokenExpiresAt: null },
      });
      throw new UnauthorizedException('Refresh token invalide ou expiré.');
    }

    // 6. Rotation : générer et stocker une nouvelle paire
    const { accessToken, refreshToken } = this.generateTokenPair(user);
    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user: this.toUserEntity(user) };
  }

  /**
   * Révoque le refresh token de l'utilisateur (déconnexion).
   *
   * Accepte le refresh token directement (pas d'access token requis)
   * → l'utilisateur peut toujours se déconnecter même si l'access token est expiré.
   *
   * Pipeline :
   *   1. Vérifie la signature JWT du refresh token
   *   2. Nettoie le hash en base
   */
  async logout(input: RefreshTokenInput): Promise<boolean> {
    let payload: JwtRefreshPayload;
    try {
      payload = this.jwtService.verify<JwtRefreshPayload>(input.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      // Token invalide ou expiré : session déjà morte, on considère le logout réussi
      return true;
    }

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { refreshTokenHash: null, refreshTokenExpiresAt: null },
    });
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Queries protégées
  // ─────────────────────────────────────────────────────────────────────────

  async getMe(userId: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Utilisateur introuvable.');
    return this.toUserEntity(user);
  }

  /**
   * Retourne les utilisateurs paginés (réservé ADMIN).
   *
   * @param take  Nombre max de résultats — borné entre 1 et 100 pour prévenir les SELECT * massifs.
   * @param skip  Décalage (offset) pour la pagination.
   */
  async getUsers(take = 50, skip = 0): Promise<UserEntity[]> {
    const safeTake = Math.min(Math.max(take, 1), 100);
    const safeSkip = Math.max(skip, 0);
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: safeTake,
      skip: safeSkip,
    });
    return users.map((user) => this.toUserEntity(user));
  }
}
