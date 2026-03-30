import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AdminRegisterDto } from './dto/admin.dto';
export declare class AdminService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: AdminRegisterDto): Promise<{
        access_token: string;
        admin: any;
    }>;
    login(admin: any): Promise<{
        access_token: string;
        admin: any;
    }>;
    validateAdmin(email: string, pass: string): Promise<any>;
}
