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
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, Prisma } from '@prisma/client';
import { RegisterDto } from './dto/auth.dto';

/**
 * Interface for a sanitized user object within the Auth context.
 * Explicitly includes fields required for JWT signing and session management.
 */
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
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  /**
   * Validates user credentials.
   * Sanitizes response by removing password.
   */
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

  async logout(userId: number, jti: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { id: jti, userId },
    });
    return { success: true };
  }

  async logoutAll(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return { success: true };
  }

  /**
   * Handles Refresh Token rotation with Reuse Protection and Distributed Locking.
   * Revokes all sessions if a compromised token is detected.
   */
  async refreshTokens(userId: number, rt: string, jti: string) {
    const lockKey = `refresh:${userId}:${jti}`;
    const lockTtl = 10000; // 10 seconds

    // acquireLock returns a UUID ownership token, or null if lock is already held
    const lockValue = await this.redisService.acquireLock(lockKey, lockTtl);
    if (!lockValue) {
      this.logger.warn(
        `Refresh token request already in progress for user ${userId}, jti ${jti}`,
      );
      throw new HttpException(
        'Too Many Requests - Rotation in progress',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    try {
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { id: jti },
      });

      // 1. Check if token exists and belongs to user
      if (!tokenRecord || tokenRecord.userId !== userId) {
        this.logger.warn(
          `Potential token theft or invalid JTI for user ${userId}`,
        );
        throw new ForbiddenException('Access Denied');
      }

      // 2. Check Expiry
      if (new Date() > tokenRecord.expiresAt) {
        await this.prisma.refreshToken
          .delete({ where: { id: jti } })
          .catch(() => {});
        throw new UnauthorizedException('Refresh token expired');
      }

      // 3. Token Reuse Protection: Validate Hash
      const rtMatches = await bcrypt.compare(rt, tokenRecord.tokenHash);
      if (!rtMatches) {
        // CRITICAL: Token reuse detected. Revoke ALL sessions.
        this.logger.error(
          `Token reuse detected for user ${userId}. Revoking all sessions.`,
        );
        await this.logoutAll(userId);
        throw new ForbiddenException(
          'Access Denied - Security Breach Detected',
        );
      }

      // 4. Verify user still exists
      const user = await this.userService.findById(userId);
      if (!user || user.isDeleted) {
        throw new ForbiddenException('User no longer exists or is deactivated');
      }

      // 5. Atomic Rotation: Delete old and issue new within transaction
      return await this.prisma.$transaction(async (tx) => {
        await tx.refreshToken.delete({ where: { id: jti } });
        return this.getTokens(user.id, user.email, user.role, tx);
      });
    } finally {
      // Release lock with ownership proof — only deletes if we still own it
      await this.redisService.releaseLock(lockKey, lockValue);
    }
  }

  /**
   * Generates Access/Refresh tokens and stores RT in DB.
   * Enforces active session limits (Max 5).
   */
  private async getTokens(
    userId: number,
    email: string,
    role: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    const jti = uuidv4();

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role, jti },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    // Session Limit Protection: Max 5 active sessions
    const sessionCount = await prisma.refreshToken.count({ where: { userId } });
    if (sessionCount >= this.MAX_SESSIONS) {
      const oldestSession = await prisma.refreshToken.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });
      if (oldestSession) {
        await prisma.refreshToken.delete({ where: { id: oldestSession.id } });
      }
    }

    const tokenHash = await bcrypt.hash(rt, this.BCRYPT_ROUNDS);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        id: jti,
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
