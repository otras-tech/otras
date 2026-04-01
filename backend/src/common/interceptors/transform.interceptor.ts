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
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Skip transformation for health check and other non-standard routes
    const request = context.switchToHttp().getRequest();
    if (request.url.includes('/health')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data || null,
      })),
    );
  }
}
