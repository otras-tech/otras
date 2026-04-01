import { PrismaService } from '../../database/prisma.service';
export declare class CleanupService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleExpiredTokensCleanup(): Promise<void>;
    handleSoftDeleteCleanup(): Promise<void>;
}
