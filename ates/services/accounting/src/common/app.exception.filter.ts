import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import e, { Response } from 'express';
import { AppException } from './app.exception';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    Logger.error(exception, exception.stack);

    if (host.getType() === 'http') {
      return this.handleHttpException(exception, host);
    }
  }

  handleHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;

    let error: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof AppException) {
      status = exception.statusCode || 400;
      error = {
        ...error,
        ...exception,
        statusCode: status,
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.getResponse();
    } else {
      error = new InternalServerErrorException().getResponse();
    }

    response.status(status).json(error);
  }
}
