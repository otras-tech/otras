import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../database/prisma.service';
import { HealthService } from './health.service';
export declare class HealthController {
    private health;
    private prismaHealth;
    private prisma;
    private healthService;
    constructor(health: HealthCheckService, prismaHealth: PrismaHealthIndicator, prisma: PrismaService, healthService: HealthService);
    check(): Promise<{
        status: string;
        info: {
            'all services': string;
        };
        error: {};
        details: {
            'all services': string;
        };
    }>;
}
