import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/** Forme du payload décodé depuis le JWT. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/** Objet attaché à req.user après validation du token. */
export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Stratégie JWT Passport.
 * Intercepte le Bearer Token depuis le header Authorization,
 * vérifie sa signature avec JWT_SECRET, et attache AuthUser
 * à req.user pour les guards et décorateurs en aval.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    // Fail-fast : l'application ne doit pas démarrer sans JWT_SECRET
    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_SECRET est absent des variables d\'environnement.',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /** Retourne l'objet attaché à req.user après validation du token. */
  validate(payload: JwtPayload): AuthUser {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
