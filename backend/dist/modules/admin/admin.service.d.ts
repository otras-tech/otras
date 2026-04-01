import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AdminRegisterDto } from './dto/admin.dto';
import { Admin } from '@prisma/client';
export declare class AdminService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: AdminRegisterDto): Promise<{
        access_token: string;
        admin: Omit<{
            password: string;
            email: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        }, "password">;
    }>;
    login(admin: Omit<Admin, 'password'>): Promise<{
        access_token: string;
        admin: Omit<{
            password: string;
            email: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        }, "password">;
    }>;
    validateAdmin(email: string, pass: string): Promise<Omit<Admin, 'password'> | null>;
}
