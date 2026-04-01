import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import {
  AuthenticatedRequest,
  HttpExceptionResponse,
} from '../../common/types/types';

// Fields to redact from error context for security
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'tokenHash',
  'refreshToken',
]);

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extract requestId for log correlation
    const requestId =
      (request as Request & { id?: string }).id ||
      request.headers['x-request-id'] ||
      'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as HttpExceptionResponse | string;
      message = typeof res === 'object' ? (res.message ?? 'Error') : res;
      error = typeof res === 'object' ? (res.error ?? 'Error') : 'Error';
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // ✅ Handle Prisma specific errors
      status = HttpStatus.BAD_REQUEST;
      switch (exception.code) {
        case 'P2002': // Unique constraint failed
          message = `Duplicate field value: ${exception.meta?.target}`;
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        default:
          message = `Database error: ${exception.message}`;
      }
      error = 'Bad Request';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId, // Include for client-side correlation
      message: Array.isArray(message) ? message[0] : message, // Take first validation error if array
      error: error,
    };

    // Log the error with context and correlation ID
    const logContext = {
      requestId,
      method: request.method,
      url: request.url,
      statusCode: status,
      userId:
        (
          request as AuthenticatedRequest & {
            user?: { id?: number; sub?: number };
          }
        ).user?.id ||
        (
          request as AuthenticatedRequest & {
            user?: { id?: number; sub?: number };
          }
        ).user?.sub,
    };

    if (status >= 500) {
      this.logger.error(
        `[${requestId}] ${request.method} ${request.url} [${status}]`,
        (exception instanceof Error ? exception.stack : undefined) ||
          JSON.stringify(this.redactSensitiveData(exception)),
        JSON.stringify(logContext),
      );
    } else {
      this.logger.warn(
        `[${requestId}] ${request.method} ${request.url} [${status}]: ${JSON.stringify(message)}`,
      );
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Recursively removes sensitive fields from an object before logging.
   */
  private redactSensitiveData(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.redactSensitiveData(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
