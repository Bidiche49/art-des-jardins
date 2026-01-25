import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only log mutating operations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const startTime = Date.now();
    const userId = request.user?.sub;
    const path = request.route?.path || request.url;
    const controllerName = context.getClass().name.replace('Controller', '');

    return next.handle().pipe(
      tap({
        next: (data) => {
          const entiteId = data?.id || request.params?.id;

          this.auditService.log({
            userId,
            action: `${method} ${path}`,
            entite: controllerName,
            entiteId,
            details: {
              body: this.sanitizeBody(request.body),
              params: request.params,
              duration: Date.now() - startTime,
            },
            ipAddress: request.ip || request.headers['x-forwarded-for'],
            userAgent: request.headers['user-agent'],
          }).catch((err) => {
            console.error('Failed to log audit:', err);
          });
        },
        error: (error) => {
          this.auditService.log({
            userId,
            action: `${method} ${path} [ERROR]`,
            entite: controllerName,
            entiteId: request.params?.id,
            details: {
              error: error.message,
              statusCode: error.status,
              duration: Date.now() - startTime,
            },
            ipAddress: request.ip || request.headers['x-forwarded-for'],
            userAgent: request.headers['user-agent'],
          }).catch((err) => {
            console.error('Failed to log audit error:', err);
          });
        },
      }),
    );
  }

  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    if (!body) return {};

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'passwordHash', 'token', 'refreshToken', 'secret'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
