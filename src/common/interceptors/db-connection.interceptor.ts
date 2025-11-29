import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, retryWhen, delay, take, concatMap } from 'rxjs/operators';

@Injectable()
export class DbConnectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Check if it's a database connection error
        const isConnectionError =
          error?.message?.includes('connection') ||
          error?.message?.includes('timeout') ||
          error?.message?.includes('ECONNREFUSED') ||
          error?.message?.includes('Connection terminated') ||
          error?.message?.includes('Unable to connect') ||
          error?.code === 'ECONNREFUSED' ||
          error?.code === 'ETIMEDOUT';

        if (isConnectionError) {
          console.error('Database connection error detected:', error.message);
          
          // Return a more user-friendly error
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                  message: 'Database connection error. Please try again.',
                  error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
              ),
          );
        }

        // For other errors, rethrow as-is
        return throwError(() => error);
      }),
    );
  }
}

