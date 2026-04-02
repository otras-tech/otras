import { AdminService } from './admin.service';
import { AdminLoginDto, AdminRegisterDto } from './dto/admin.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    register(dto: AdminRegisterDto): Promise<{
        access_token: string;
        admin: Omit<{
            password: string;
            isDeleted: boolean;
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        }, "password">;
    }>;
    login(dto: AdminLoginDto): Promise<{
        access_token: string;
        admin: Omit<{
            password: string;
            isDeleted: boolean;
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        }, "password">;
    }>;
}
