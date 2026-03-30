import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
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

    if (user && user.role === 'admin') {
      return true;
    }

    throw new UnauthorizedException('Admin privileges required');
  }
}
