import { AdminService } from './admin.service';
import { AdminLoginDto, AdminRegisterDto } from './dto/admin.dto';
import { RequestUser } from '../../common/types/types';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    register(dto: AdminRegisterDto): Promise<{
        admin: Omit<{
            password: string;
            isDeleted: boolean;
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        }, "password">;
        accessToken: string;
        refreshToken: string;
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: AdminLoginDto): Promise<{
        admin: Omit<{
            password: string;
            isDeleted: boolean;
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        }, "password">;
        accessToken: string;
        refreshToken: string;
        access_token: string;
        refresh_token: string;
    }>;
    logout(user: RequestUser): Promise<any>;
    refresh(user: RequestUser): Promise<any>;
}
