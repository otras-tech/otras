import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
export declare class ScalableThrottlerGuard extends ThrottlerGuard {
    private readonly configService;
    private readonly logger;
    constructor(options: ThrottlerModuleOptions, storage: ThrottlerStorage, reflector: Reflector, configService: ConfigService);
    protected shouldSkip(context: ExecutionContext): Promise<boolean>;
}
