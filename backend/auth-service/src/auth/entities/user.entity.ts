import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../common/enums/role.enum';

/**
 * Entité GraphQL User — représentation publique de l'utilisateur.
 * Le champ `password` est volontairement absent : il ne doit jamais
 * être exposé dans le schéma GraphQL.
 */
@ObjectType()
export class UserEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => Role)
  role!: Role;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
