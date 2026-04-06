import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_OWNERSHIP_KEY, OwnershipOptions } from '../decorators/check-ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  private readonly logger = new Logger(OwnershipGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.get<OwnershipOptions>(
      CHECK_OWNERSHIP_KEY,
      context.getHandler(),
    );

    // If metadata is not set, we assume ownership check is not required for this route
    if (!options) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard

    if (!user) {
      throw new ForbiddenException('Authentication required for ownership check');
    }

    // 🛡️ [RBAC-BYPASS] Admins are superusers and can skip ownership checks
    if (user.role?.toUpperCase() === 'ADMIN') {
      return true;
    }

    const paramName = options.param || 'id';
    
    // Resolve target ID from Request.params, then body, then query
    const targetIdStr =
      request.params[paramName] ||
      request.body[paramName] ||
      request.query[paramName];

    if (!targetIdStr) {
      this.logger.warn(`OwnershipGuard: Target ID '${paramName}' not found in request context`);
      return true; // Nothing to check against, allow through (let controller handle missing ID)
    }

    const targetId = parseInt(targetIdStr, 10);

    if (user.id !== targetId) {
      this.logger.error(`Ownership Error: User ${user.id} (${user.email}) attempted to access resource belonging to User ${targetId}`);
      throw new ForbiddenException('Access denied: Ownership verification failed');
    }

    return true;
  }
}
