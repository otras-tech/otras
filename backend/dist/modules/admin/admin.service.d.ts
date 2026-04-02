import { AdminRepository } from './repository/admin.repository';
import { JwtService } from '@nestjs/jwt';
import { AdminRegisterDto } from './dto/admin.dto';
import { Admin } from '@prisma/client';
export declare class AdminService {
    private readonly repository;
    private readonly jwtService;
    constructor(repository: AdminRepository, jwtService: JwtService);
    register(data: AdminRegisterDto): Promise<{
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
    login(admin: Omit<Admin, 'password'>): Promise<{
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
    validateAdmin(email: string, pass: string): Promise<Omit<Admin, 'password'> | null>;
}
