import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'secret',
    });
  }

  async validate(payload: any) {
    // verify user exists and is not deleted
    const user = await this.userService.findById(payload.sub);
    if (!user || user.isDeleted) {
       throw new UnauthorizedException('User account invalid or inactive');
    }
    
    // Pass everything needed for further guards (RBAC, Session)
    return { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        jti: payload.jti // Add jti here if we want access tokens to be revocable (optional, but good for logout sanity)
    };
  }
}
