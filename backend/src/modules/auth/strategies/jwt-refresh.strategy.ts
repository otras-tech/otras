import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || 'secret',
      passReqToCallback: true,
    } as any);
  }

  async validate(req: Request, payload: any) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const refreshToken = authHeader.replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token malformed');
    }
    
    // Ensure jti exists in payload
    if (!payload.jti) {
        throw new UnauthorizedException('Invalid session metadata');
    }

    return { 
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        jti: payload.jti,
        refreshToken 
    };
  }
}
