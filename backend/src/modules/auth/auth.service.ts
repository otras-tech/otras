import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './repository/auth.repository';
import { AdminRepository } from '../admin/repository/admin.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, Prisma } from '@prisma/client';
import { RegisterDto } from './dto/auth.dto';

export type AuthUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly BCRYPT_ROUNDS = 12;
  private readonly MAX_SESSIONS = 5;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private repository: AuthRepository,
    private adminRepository: AdminRepository,
    private redisService: RedisService,
  ) { }

  async validateUser(loginId: string, pass: string): Promise<AuthUser | null> {
    const user: User | null = await this.userService.findByEmail(loginId);
    const targetUser = user || (await this.userService.findByOtrId(loginId));

    if (
      targetUser &&
      !targetUser.isDeleted &&
      (await bcrypt.compare(pass, targetUser.password))
    ) {
      const { password, ...result } = targetUser;
      return result;
    }
    return null;
  }

  async register(data: RegisterDto) {
    const user = await this.userService.create(data);
    if (!user) {
      throw new UnauthorizedException('Registration failed');
    }

    const { password: _pw, ...safeUser } = user;
    return this.login(safeUser);
  }

  async login(user: AuthUser) {
    if (!user.id || !user.email) {
      throw new UnauthorizedException('Invalid user data');
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role || 'USER',
    );

    return {
      ...tokens,
      user,
    };
  }

  async logout(userId: number, jti: string, role: string) {
    const userType = role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
    await this.repository.deleteTokenByJti(jti, userId, userType);
    return { success: true };
  }

  async logoutAll(userId: number, role: string) {
    const userType = role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
    await this.repository.deleteTokensByUserId(userId, userType);
    return { success: true };
  }

  async refreshTokens(userId: number, rt: string, jti: string, role: string) {
    const userType = role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
    const lockKey = `refresh:${userType}:${userId}:${jti}`;
    const lockTtl = 10000;

    const lockValue = await this.redisService.acquireLock(lockKey, lockTtl);
    if (!lockValue) {
      this.logger.warn(`Refresh token rotation in progress for ${userType} ${userId}, jti ${jti}`);
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    try {
      const tokenRecord = await this.repository.findTokenById(jti);

      if (!tokenRecord || tokenRecord.userId !== userId || tokenRecord.userType !== userType) {
        this.logger.warn(`Invalid JTI or UserType for user ${userId}`);
        throw new ForbiddenException('Access Denied');
      }

      if (new Date() > tokenRecord.expiresAt) {
        await this.repository.deleteToken(jti);
        throw new UnauthorizedException('Refresh token expired');
      }

      const rtMatches = await bcrypt.compare(rt, tokenRecord.tokenHash);
      if (!rtMatches) {
        this.logger.error(`Token reuse detected for ${userType} ${userId}. Revoking all sessions.`);
        await this.logoutAll(userId, userType);
        throw new ForbiddenException('Security Breach Detected');
      }

      let identity: any;
      if (userType === 'ADMIN') {
        identity = await this.adminRepository.findById(userId);
      } else {
        identity = await this.userService.findById(userId);
      }

      if (!identity || (identity as any).isDeleted) {
        throw new ForbiddenException('Account deactivated');
      }

      return await this.repository.runTransaction(async (tx) => {
        await this.repository.deleteToken(jti, tx);
        return this.getTokens(userId, (identity as any).email, role, tx);
      });
    } finally {
      await this.redisService.releaseLock(lockKey, lockValue);
    }
  }

  async getTokens(
    userId: number,
    email: string,
    role: string,
    tx?: Prisma.TransactionClient,
  ) {
    const jti = uuidv4();
    const userType = role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';

    this.logger.debug(`[AUTH-SERVICE] Generating tokens for ${userType}: ${userId}, Email: ${email}`);

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role: role.toUpperCase() },
        { expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role: role.toUpperCase(), jti },
        { expiresIn: '7d' },
      ),
    ]);

    const sessionCount = await this.repository.countTokensByUserId(userId, userType, tx);
    if (sessionCount >= this.MAX_SESSIONS) {
      const oldestSession = await this.repository.findOldestSession(userId, userType, tx);
      if (oldestSession) {
        await this.repository.deleteToken(oldestSession.id, tx);
      }
    }

    const tokenHash = await bcrypt.hash(rt, this.BCRYPT_ROUNDS);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.createRefreshToken({
      id: jti,
      userId,
      userType,
      tokenHash,
      expiresAt,
    }, tx);

    return {
      accessToken: at,
      refreshToken: rt,
      access_token: at,
      refresh_token: rt,
    };
  }
}
