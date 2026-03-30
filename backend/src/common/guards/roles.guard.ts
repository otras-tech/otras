import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Safety check: JwtAuthGuard must be used before RolesGuard
    if (!user) {
        throw new UnauthorizedException('Authentication required for this resource');
    }

    if (!user.role) {
        throw new ForbiddenException('User has no assigned role');
    }

    // Support for future expansion where user might have multiple roles
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    
    if (!hasRole) {
        throw new ForbiddenException(
            `Insufficient permissions. Required one of: [${requiredRoles.join(', ')}]`
        );
    }

    return true;
  }
}
