import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(private configService: ConfigService) {
    super();
  }

  async checkRedis(): Promise<HealthIndicatorResult> {
    const isRedisDisabled = this.configService.get('DISABLE_REDIS') === 'true';
    const redisUrl = this.configService.get('REDIS_URL') || 'redis://127.0.0.1:6379';
    const client = createClient({ 
      url: redisUrl,
      socket: {
        connectTimeout: 2000,
        reconnectStrategy: false
      }
    });

    try {
      if (isRedisDisabled) {
        return this.getStatus('redis', true, { message: 'Skipped (Disabled)' });
      }
      await client.connect();
      await client.ping();
      await client.quit();
      return this.getStatus('redis', true);
    } catch (e) {
      // In development or if marked disabled, we don't want to fail the whole HC
      return this.getStatus('redis', isRedisDisabled, { message: e.message });
    } finally {
      if (client.isOpen) await client.disconnect();
    }
  }
}
