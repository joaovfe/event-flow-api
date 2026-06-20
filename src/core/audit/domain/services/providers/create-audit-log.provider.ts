import { plainToInstance } from 'class-transformer';

import { AuditLogRepository } from '../../repositories/audit-log.repository';
import { AuditLogEntity } from '../../entities/audit-log.entity';
import { AuditEvent } from '../../events/audit.event';

export class CreateAuditLogProvider {
  public constructor(private readonly auditLogRepository: AuditLogRepository) {}

  public async execute({ event }: { event: AuditEvent }) {
    const auditLog = plainToInstance(AuditLogEntity, event);

    return await this.auditLogRepository.manager.save(auditLog);
  }
}
