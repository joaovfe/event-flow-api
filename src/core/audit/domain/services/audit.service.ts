import { Injectable } from '@nestjs/common';

import { AuditLogRepository } from '../repositories/audit-log.repository';

import { CreateAuditLogProvider } from './providers/create-audit-log.provider';
import { FindManyAuditLogProvider } from './providers/find-many-audit-log.provider';

@Injectable()
export class AuditService {
  public create: CreateAuditLogProvider;
  public findMany: FindManyAuditLogProvider;

  public constructor(private readonly auditLogRepository: AuditLogRepository) {
    this.create = new CreateAuditLogProvider(this.auditLogRepository);
    this.findMany = new FindManyAuditLogProvider(this.auditLogRepository);
  }
}
