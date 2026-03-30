import { RedisService } from '../../common/redis/redis.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/auth.dto';
export interface AuthUser {
    id: number;
    email: string;
    role: string;
    isDeleted: boolean;
    [key: string]: any;
}
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    private prisma;
    private redisService;
    private readonly logger;
    private readonly BCRYPT_ROUNDS;
    private readonly MAX_SESSIONS;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, prisma: PrismaService, redisService: RedisService);
    validateUser(loginId: string, pass: string): Promise<AuthUser | null>;
    register(data: RegisterDto): Promise<{
        user: AuthUser;
        access_token: string;
        refresh_token: string;
    }>;
    login(user: AuthUser): Promise<{
        user: AuthUser;
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: number, jti: string): Promise<{
        success: boolean;
    }>;
    logoutAll(userId: number): Promise<{
        success: boolean;
    }>;
    refreshTokens(userId: number, rt: string, jti: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    private getTokens;
}
