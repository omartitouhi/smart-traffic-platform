import { registerEnumType } from '@nestjs/graphql';

/**
 * Enum Role — miroir de l'enum Prisma.
 * Enregistré dans le schéma GraphQL via registerEnumType.
 */
export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Rôles disponibles dans le système',
});
