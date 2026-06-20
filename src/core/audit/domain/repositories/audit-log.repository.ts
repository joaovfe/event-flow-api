import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

import { AuditLogEntity } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLogEntity> {
  public constructor(
    @InjectRepository(AuditLogEntity)
    repository: Repository<AuditLogEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
