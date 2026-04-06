import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { AdminService } from '../../admin/admin.service';
import { JwtPayload, RequestUser } from '../../../common/types/types';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private adminService: AdminService,
  ) {
    const accessSecret = (configService.get<string>('JWT_ACCESS_SECRET') || configService.get<string>('jwt.accessSecret') || 'secret').trim();
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
    console.log(`[AUTH-STRATEGY-PROOF] Secret Length: ${accessSecret.length}, Prefix: ${accessSecret.substring(0, 4)}...`);
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const logger = new Logger(JwtStrategy.name);
    logger.debug(`[JWT-STRATEGY] Validating token for Payload: ${JSON.stringify(payload)}`);
    
    if (!payload.sub || isNaN(Number(payload.sub))) {
      logger.warn(`[JWT-STRATEGY] Invalid payload: missing or non-numeric sub`);
      throw new UnauthorizedException('Invalid token payload: missing sub');
    }

    const userId = Number(payload.sub);
    const role = (payload as any).role?.toUpperCase();

    logger.verbose(`[JWT-STRATEGY] Lookup initiated for ${role} with ID ${userId}`);

    let identity: any = null;
    try {
      if (role === 'ADMIN') {
        identity = await this.adminService.findById(userId);
      } else {
        // Default to USER if no role or role is USER
        identity = await this.userService.findById(userId);
      }
    } catch (dbError: any) {
      logger.error(`[JWT-STRATEGY] Database lookup failed: ${dbError.message}`);
      throw new UnauthorizedException('Identity lookup failed');
    }
    
    if (!identity || identity.isDeleted) {
      logger.warn(`[JWT-STRATEGY] ${role || 'User'} ${userId} not found or deleted`);
      throw new UnauthorizedException(`${role || 'User'} account invalid or inactive`);
    }

    logger.debug(`[JWT-STRATEGY] Identity verified: ${identity.email} (Role: ${identity.role || role})`);

    // Pass everything needed for further guards (RBAC, Session)
    return {
      id: identity.id,
      email: identity.email,
      role: (identity as any).role || role || 'USER',
      otrId: (identity as any).otrId || null,
      jti: payload.jti,
    };
  }
}
