import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IApiResponse } from '../interfaces/response.interface';

interface HttpExceptionResponse {
  message: string | string[];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const typed = res as HttpExceptionResponse;
        message = Array.isArray(typed.message)
          ? typed.message[0]
          : typed.message ?? exception.message;
      } else {
        message = exception.message;
      }
    }

    const responseBody: IApiResponse<null> = {
      success: false,
      message,
      data: null,
      statusCode: status,
    };

    response.status(status).json(responseBody);
  }
}
