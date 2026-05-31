import { ObjectType, Field } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

/**
 * Entité GraphQL retournée après login/register/refresh.
 * - accessToken  : JWT de courte durée (ex: 15m) — utilisé pour les requêtes API
 * - refreshToken : JWT de longue durée (ex: 7j) — utilisé uniquement pour renouveler la paire
 */
@ObjectType()
export class AuthPayloadEntity {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserEntity)
  user: UserEntity;
}
