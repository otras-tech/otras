import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  // Can be extended with custom logging metrics or third-party integrations (e.g. Datadog, Sentry)
}
