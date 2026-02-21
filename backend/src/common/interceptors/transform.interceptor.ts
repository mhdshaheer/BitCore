import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from '../interfaces/response.interface';

interface ServiceResponse<T> {
  message?: string;
  data?: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  ServiceResponse<T> | T,
  IApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((res: ServiceResponse<T> | T) => {
        const isServiceResponse = (obj: unknown): obj is ServiceResponse<T> => {
          return (
            !!obj &&
            typeof obj === 'object' &&
            ('message' in obj || 'data' in obj)
          );
        };

        if (isServiceResponse(res)) {
          return {
            success: true,
            message: res.message || 'Operation successful',
            data: res.data as T,
            statusCode: response.statusCode,
          };
        }

        return {
          success: true,
          message: 'Operation successful',
          data: res,
          statusCode: response.statusCode,
        };
      }),
    );
  }
}
