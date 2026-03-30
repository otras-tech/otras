import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
export declare class HealthService extends HealthIndicator {
    private configService;
    constructor(configService: ConfigService);
    checkRedis(): Promise<HealthIndicatorResult>;
}
