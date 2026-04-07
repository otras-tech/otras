import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ScalableThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(ScalableThrottlerGuard.name);

  constructor(
    options: ThrottlerModuleOptions,
    storage: ThrottlerStorage,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(options, storage, reflector);
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // ✅ Global toggle
    const configDisable = this.configService.get('throttler.disable');
    const envDisable = this.configService.get('DISABLE_THROTTLER');
    
    this.logger.debug(`Checking throttle skip: throttler.disable=${configDisable}, DISABLE_THROTTLER=${envDisable}`);

    const disableThrottler =
      configDisable === true ||
      configDisable === 'true' ||
      envDisable === 'true' ||
      envDisable === true;

    if (disableThrottler) {
      this.logger.debug('Throttler disabled, skipping...');
      return true;
    }

    // ✅ Bypass for internal load testing if secret header matches
    const internalSecret = this.configService.get('INTERNAL_LOAD_TEST_SECRET');
    const requestSecret = request.headers['x-internal-secret'];
    
    if (internalSecret && requestSecret === internalSecret) {
      this.logger.debug(`Bypassing throttler for internal request: ${request.url}`);
      return true;
    }

    return false;
  }
}
