import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  status: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  requestId?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const error = this.getErrorName(status);

    const errorResponse: ErrorResponse = {
      status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log errors
    if (status >= 500) {
      // Log full stack trace for server errors
      this.logger.error(
        `${request.method} ${request.url} - ${status} ${error}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else if (status >= 400) {
      // Log warning for client errors
      this.logger.warn(
        `${request.method} ${request.url} - ${status} ${error}: ${message}`,
      );
    }

    // In production, don't expose internal error details for 500 errors
    if (status >= 500 && process.env.NODE_ENV === 'production') {
      errorResponse.message = 'Une erreur interne est survenue';
    }

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (typeof response === 'object' && response !== null) {
        const resp = response as Record<string, unknown>;
        // Handle validation errors (array of messages)
        if (Array.isArray(resp.message)) {
          return resp.message.join(', ');
        }
        if (typeof resp.message === 'string') {
          return resp.message;
        }
      }
    }
    if (exception instanceof Error) {
      return exception.message;
    }
    return 'Une erreur est survenue';
  }

  private getErrorName(status: number): string {
    const errorNames: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return errorNames[status] || 'Error';
  }
}
