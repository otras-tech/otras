import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, run the standard JWT validation
    const valid = await super.canActivate(context);
    if (!valid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.role && user.role.toUpperCase() === 'ADMIN') {
      return true;
    }

    throw new ForbiddenException('Admin privileges required');
  }
}
