import { RedisService } from '../../common/redis/redis.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './repository/auth.repository';
import { AdminRepository } from '../admin/repository/admin.repository';
import { User, Prisma } from '@prisma/client';
import { RegisterDto } from './dto/auth.dto';
export type AuthUser = Omit<User, 'password'>;
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    private repository;
    private adminRepository;
    private redisService;
    private readonly logger;
    private readonly BCRYPT_ROUNDS;
    private readonly MAX_SESSIONS;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, repository: AuthRepository, adminRepository: AdminRepository, redisService: RedisService);
    validateUser(loginId: string, pass: string): Promise<AuthUser | null>;
    register(data: RegisterDto): Promise<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
        access_token: string;
        refresh_token: string;
    }>;
    login(user: AuthUser): Promise<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: number, jti: string, role: string): Promise<{
        success: boolean;
    }>;
    logoutAll(userId: number, role: string): Promise<{
        success: boolean;
    }>;
    refreshTokens(userId: number, rt: string, jti: string, role: string): Promise<{
        accessToken: string;
        refreshToken: string;
        access_token: string;
        refresh_token: string;
    }>;
    getTokens(userId: number, email: string, role: string, tx?: Prisma.TransactionClient): Promise<{
        accessToken: string;
        refreshToken: string;
        access_token: string;
        refresh_token: string;
    }>;
}
