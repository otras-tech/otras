import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
}
