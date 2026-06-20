import { Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuditLogController } from '@core/audit/application/decorators/audit-log-controller.decorator';
import { AuditLogEntity } from '@core/audit/domain/entities/audit-log.entity';
import { FindManyAuditLogDTO } from '@core/audit/domain/dtos/find-many-audit-log.dto';
import { AuditService } from '@core/audit/domain/services/audit.service';

@AuditLogController.default()
export class DefaultAuditLogController {
  public constructor(private readonly service: AuditService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar a trilha de auditoria das ações administrativas',
    dtoName: 'FindManyAuditLogDTO',
    roles: ['MASTER'],
    responses: [
      {
        description: 'Listagem da trilha de auditoria',
        status: 200,
        findManyModel: AuditLogEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyAuditLogDTO) {
    return await this.service.findMany.execute(dto);
  }
}
