import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuditLogEntity } from './domain/entities/audit-log.entity';
import { AuditLogRepository } from './domain/repositories/audit-log.repository';
import { AuditService } from './domain/services/audit.service';
import { AuditInterceptor } from './domain/interceptors/audit.interceptor';
import { PersistAuditListener } from './domain/listeners/persist-audit.listener';
import { LogAuditListener } from './domain/listeners/log-audit.listener';
import { AuditLogControllers } from './application/controllers/audit-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  controllers: [...AuditLogControllers],
  providers: [
    AuditLogRepository,
    AuditService,
    PersistAuditListener,
    LogAuditListener,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AuditModule {}
