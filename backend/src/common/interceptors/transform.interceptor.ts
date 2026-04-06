import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();

    // Skip transformation for health check and other non-standard routes
    if (request.url.includes('/health')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If data already has a 'data' and 'meta' structure, preserve it
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return {
            success: true,
            ...data,
          };
        }

        // Standard wrapping
        return {
          success: true,
          data: data || null,
        };
      }),
    );
  }
}

