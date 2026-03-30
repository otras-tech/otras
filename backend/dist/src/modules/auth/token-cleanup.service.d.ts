import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
export declare class TokenCleanupService {
    private prisma;
    private redisService;
    private readonly logger;
    private readonly BATCH_SIZE;
    constructor(prisma: PrismaService, redisService: RedisService);
    handleTokenCleanup(): Promise<void>;
}
