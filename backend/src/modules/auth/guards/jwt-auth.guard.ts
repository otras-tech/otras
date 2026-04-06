import {
  Injectable,
  Logger,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    const logger = new Logger(JwtAuthGuard.name);
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (err || !user) {
      const failureReason = info?.message || (err ? err.message : 'Missing Token');
      
      logger.error({
        msg: 'Authentication Failed',
        reason: failureReason,
        path: req.url,
        method: req.method,
        hasAuthHeader: !!authHeader,
        info: info,
      });

      // Maintain security by throwing UnauthorizedException
      // but provide a clear diagnostic message in the response
      throw err || new UnauthorizedException(
        info?.message === 'No auth token' 
          ? 'Authorization token is missing. Ensure you use the "Bearer <token>" format.' 
          : `Unauthorized: ${failureReason}`
      );
    }
    
    logger.debug(`Authentication Successful for User: ${user.email} (Role: ${user.role})`);
    return user;
  }
}
