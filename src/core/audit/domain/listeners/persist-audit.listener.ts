import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AuditService } from '../services/audit.service';
import { AuditEvent, AUDIT_EVENT } from '../events/audit.event';

/**
 * Observer concreto: ao ser notificado de um AuditEvent, persiste a
 * trilha de auditoria na tabela audit_logs.
 */
@Injectable()
export class PersistAuditListener {
  public constructor(private readonly auditService: AuditService) {}

  @OnEvent(AUDIT_EVENT)
  public async handle(event: AuditEvent): Promise<void> {
    await this.auditService.create.execute({ event });
  }
}
