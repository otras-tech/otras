import { AdminRepository } from './repository/admin.repository';
import { AuthService } from '../auth/auth.service';
import { AdminRegisterDto } from './dto/admin.dto';
import { Admin } from '@prisma/client';
export declare class AdminService {
    private readonly repository;
    private readonly authService;
    constructor(repository: AdminRepository, authService: AuthService);
    findById(id: number): Promise<{
        password: string;
        isDeleted: boolean;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
    } | null>;
    register(data: AdminRegisterDto): Promise<{
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
    login(admin: Omit<Admin, 'password'>): Promise<{
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
    validateAdmin(email: string, pass: string): Promise<Admin | null>;
}
