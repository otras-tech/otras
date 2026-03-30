import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        sub?: number;
        email: string;
        role: string;
        jti: string;
        refreshToken: string;
    };
}
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: import("./auth.service").AuthUser;
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: import("./auth.service").AuthUser;
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: AuthenticatedRequest): Promise<{
        success: boolean;
    }>;
    logoutAll(req: AuthenticatedRequest): Promise<{
        success: boolean;
    }>;
    refreshTokens(req: AuthenticatedRequest): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
export {};
