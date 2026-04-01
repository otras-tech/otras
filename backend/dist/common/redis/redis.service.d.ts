import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private client;
    private isDisabled;
    private readonly localLocks;
    private localLockCleanupInterval;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    getClient(): Redis | null;
    acquireLock(key: string, ttl: number): Promise<string | null>;
    releaseLock(key: string, lockValue?: string | null): Promise<void>;
    zAdd(key: string, score: number, member: string): Promise<void>;
    zRevRank(key: string, member: string): Promise<number | null>;
    zCard(key: string): Promise<number>;
}
