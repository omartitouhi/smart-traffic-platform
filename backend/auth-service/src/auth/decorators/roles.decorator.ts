import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

/**
 * Clé de métadonnée utilisée par RolesGuard pour lire les rôles requis.
 */
export const ROLES_KEY = 'roles';

/**
 * Décorateur @Roles(...roles).
 * Pose des métadonnées sur un resolver ou une mutation pour
 * indiquer à RolesGuard quels rôles sont autorisés à y accéder.
 *
 * Usage : @Roles(Role.ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
