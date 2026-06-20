import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AuditEvent, AUDIT_EVENT } from '../events/audit.event';

/**
 * Segundo Observer do mesmo AuditEvent, independente do primeiro: escreve
 * a ação no logger da aplicação. Demonstra que novos observadores podem
 * ser adicionados sem alterar o AuditInterceptor ou os demais listeners.
 */
@Injectable()
export class LogAuditListener {
  private readonly logger = new Logger('Audit');

  @OnEvent(AUDIT_EVENT)
  public handle(event: AuditEvent): void {
    const actor = event.actorEmail ?? 'usuário anônimo';
    const result = event.success ? 'sucesso' : 'falha';

    this.logger.log(
      `[${result}] ${actor} executou ${event.action} em ${event.resource} via ${event.httpMethod} ${event.path} (status ${event.statusCode})`,
    );
  }
}
