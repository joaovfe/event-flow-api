import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

import { AuditLogEntity } from '../../entities/audit-log.entity';
import { AuditLogRepository } from '../../repositories/audit-log.repository';
import { FindManyAuditLogDTO } from '../../dtos/find-many-audit-log.dto';

export class FindManyAuditLogProvider {
  public constructor(private readonly auditLogRepository: AuditLogRepository) {}

  public async execute(dto: FindManyAuditLogDTO) {
    const where: FindOptionsWhere<AuditLogEntity> = {};
    const order: FindOptionsOrder<AuditLogEntity> = {};

    if (dto.action) {
      where.action = dto.action;
    }

    if (dto.resource) {
      where.resource = dto.resource;
    }

    if (dto.search) {
      where.description = ILike(`%${dto.search}%`);
    }

    if (dto.orderBy) {
      order[dto.orderBy] = dto.ordering ?? 'ASC';
    } else {
      order.createdAt = 'DESC';
    }

    const { take, skip } = dto;

    const [data, total] = await this.auditLogRepository.manager.findAndCount({
      where,
      order,
      take,
      skip,
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    return { data, total, pages };
  }
}
