import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('RolesGuard executed');

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    console.log(`[ROLES-GUARD] Required Roles: ${JSON.stringify(requiredRoles)}`);
    console.log(`[ROLES-GUARD] User from Request: ${JSON.stringify(user)}`);

    // Safety check: JwtAuthGuard must be used before RolesGuard
    if (!user) {
      console.error('[ROLES-GUARD] Access denied: Authentication session context missing');
      throw new ForbiddenException(
        'Access denied: Authentication session context missing',
      );
    }


    if (!user.role) {
      console.error(`[ROLES-GUARD] User ${user.email} has no assigned role`);
      throw new ForbiddenException('User has no assigned role');
    }

    // Support for future expansion where user might have multiple roles
    const userRoles = Array.isArray(user.role)
      ? user.role.map((r: string) => r.toUpperCase())
      : [user.role.toUpperCase()];

    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role.toUpperCase()),
    );

    console.log(`[ROLES-GUARD] User Roles: ${JSON.stringify(userRoles)}, Has Required Role: ${hasRole}`);

    if (!hasRole) {
      console.warn(`[ROLES-GUARD] Insufficient permissions for user ${user.email}. Required: [${requiredRoles.join(', ')}], Found: [${userRoles.join(', ')}]`);
      throw new ForbiddenException(
        `Insufficient permissions. Required one of: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
