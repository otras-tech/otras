import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User, Admin } from '@prisma/client';

export interface TokenPayload {
  sub: number;
  email: string;
  role: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(loginId: string, pass: string): Promise<Omit<User, 'password'> | null> {
    let user = await this.userService.findByEmail(loginId);
    if (!user) {
      user = await this.userService.findByOtrId(loginId);
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User | Admin> & { id: number }, isAdmin = false) {
    const payload: TokenPayload = {
      email: (user as User).email || (user as Admin).username,
      sub: user.id,
      role: isAdmin ? 'ADMIN' : (user as User).role || 'USER',
    };

    const tokens = await this.getTokens(
      payload.sub,
      payload.email,
      payload.role,
    );
    await this.updateRefreshToken(user.id, tokens.refresh_token, isAdmin);

    // Update last login
    if (isAdmin) {
      await this.prisma.admin.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    }

    return {
      ...tokens,
      user: isAdmin ? undefined : user,
      admin: isAdmin ? user : undefined,
    };
  }

  async logout(userId: number, isAdmin = false) {
    if (isAdmin) {
      return this.prisma.admin.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(userId: number, refreshToken: string, isAdmin = false) {
    const user = isAdmin
      ? await this.prisma.admin.findUnique({ where: { id: userId } })
      : await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(
      user.id,
      user.email || (user as any).username,
      isAdmin ? 'ADMIN' : (user as any).role,
    );
    await this.updateRefreshToken(user.id, tokens.refresh_token, isAdmin);
    return tokens;
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
    isAdmin = false,
  ) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    if (isAdmin) {
      await this.prisma.admin.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
      });
    }
  }

  async getTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(data: any) {
    const user = await this.userService.create(data);
    return this.login(user);
  }
}
