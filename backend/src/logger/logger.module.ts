import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';

// Fields that must NEVER appear in logs
const REDACTED_FIELDS = [
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'tokenHash',
];

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        pinoHttp: {
          level:
            config.get<string>('NODE_ENV') !== 'production' ? 'debug' : 'info',
          transport:
            config.get<string>('NODE_ENV') !== 'production'
              ? { target: 'pino-pretty', options: { colorize: true } }
              : undefined,

          // ─── Request ID / Correlation ID ────────────────────────────
          // Uses x-request-id header if present (from API gateway / LB),
          // otherwise generates a UUID. This ID is attached to every log
          // line for the request lifecycle and returned in responses.
          genReqId: (req: IncomingMessage) => {
            return (req.headers['x-request-id'] as string) || uuidv4();
          },

          // ─── Auto-logging ──────────────────────────────────────────
          // pino-http automatically logs request start + response with
          // duration (responseTime) when autoLogging is true.
          autoLogging: true,

          // ─── Custom Properties ─────────────────────────────────────
          customProps: (req: IncomingMessage) => ({
            userId:
              (
                req as IncomingMessage & {
                  user?: { id?: number; sub?: number };
                }
              ).user?.id ||
              (
                req as IncomingMessage & {
                  user?: { id?: number; sub?: number };
                }
              ).user?.sub,
            correlationId: (req as IncomingMessage & { id?: string }).id,
          }),

          // ─── Request Serializer (redact sensitive headers) ─────────
          serializers: {
            req: (
              req: IncomingMessage & {
                id?: string;
                query?: unknown;
                params?: unknown;
              },
            ) => ({
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              // Redact authorization header
              headers: {
                'user-agent': req.headers?.['user-agent'],
                'content-type': req.headers?.['content-type'],
                'x-request-id': req.headers?.['x-request-id'],
              },
            }),
            res: (res: ServerResponse) => ({
              statusCode: res.statusCode,
            }),
          },

          // ─── Redaction paths (pino built-in) ───────────────────────
          redact: {
            paths: REDACTED_FIELDS.map((f) => `*.${f}`),
            censor: '[REDACTED]',
          },
        },
      }),
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService, PinoLoggerModule],
})
export class LoggerModule {}
