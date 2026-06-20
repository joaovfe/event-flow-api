import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UserEntity } from '@modules/user/domain/entities/user.entity';

import { AUDIT_KEY, IAuditMetadata } from '../decorators/audit.decorator';
import { AuditEvent, AUDIT_EVENT } from '../events/audit.event';

const SENSITIVE_FIELDS = [
  'password',
  'newPassword',
  'oldPassword',
  'token',
  'refreshToken',
];

/**
 * Subject do Observer: ao final de toda rota marcada com @Audit (explícita
 * ou derivada de abilities+actions pelo Endpoint), publica um AuditEvent.
 * Não conhece quem vai consumir o evento (persistência, logger, etc).
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const metadata = this.reflector.getAllAndOverride<IAuditMetadata>(
      AUDIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!metadata) {
      return next.handle();
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserEntity }>();

    return next.handle().pipe(
      tap((response) => {
        const statusCode = context
          .switchToHttp()
          .getResponse<Response>().statusCode;
        this.publish(metadata, request, response, statusCode, true);
      }),
      catchError((error) => {
        const statusCode = error?.getStatus?.() ?? 500;
        this.publish(metadata, request, undefined, statusCode, false);
        throw error;
      }),
    );
  }

  private publish(
    metadata: IAuditMetadata,
    request: Request & { user?: UserEntity },
    response: unknown,
    statusCode: number,
    success: boolean,
  ) {
    const user = request.user;

    this.eventEmitter.emit(
      AUDIT_EVENT,
      new AuditEvent({
        action: metadata.action,
        resource: metadata.resource,
        description:
          metadata.description ?? `${metadata.action} ${metadata.resource}`,
        actorId: user?.id,
        actorName: user?.name,
        actorEmail: user?.email,
        actorRole: user?.role?.reference,
        targetId: this.resolveTargetId(request, response),
        httpMethod: request.method,
        path: request.path,
        statusCode,
        success,
        ipAddress: request.ip,
        metadata: this.sanitize({
          params: request.params,
          query: request.query,
          body: request.body,
        }),
      }),
    );
  }

  private resolveTargetId(
    request: Request,
    response: unknown,
  ): string | undefined {
    if (request.params?.id) {
      return String(request.params.id);
    }

    const target = response as { id?: unknown; uuid?: unknown };

    if (target?.id !== undefined) {
      return String(target.id);
    }

    if (target?.uuid !== undefined) {
      return String(target.uuid);
    }

    return undefined;
  }

  private sanitize(payload: Record<string, unknown>) {
    return JSON.parse(
      JSON.stringify(payload, (key, value) =>
        SENSITIVE_FIELDS.includes(key) ? undefined : value,
      ),
    );
  }
}
