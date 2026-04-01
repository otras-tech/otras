import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { RequestUser } from '../../common/types/types';
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
    logout(user: RequestUser): Promise<{
        success: boolean;
    }>;
    logoutAll(user: RequestUser): Promise<{
        success: boolean;
    }>;
    refreshTokens(user: RequestUser): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
