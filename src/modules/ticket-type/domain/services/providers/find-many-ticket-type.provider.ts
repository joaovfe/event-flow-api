import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

import { FindManyTicketTypeDTO } from '@modules/ticket-type/domain/dtos/find-many-ticket-type.dto';
import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';
import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';

export class FindManyTicketTypeProvider {
  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {}

  public async execute({ dto }: { dto: FindManyTicketTypeDTO }) {
    const where: FindOptionsWhere<TicketTypeEntity> = {};
    const order: FindOptionsOrder<TicketTypeEntity> = {};

    if (dto.eventId) {
      where.event = { id: dto.eventId };
    }

    if (dto.active !== undefined) {
      where.active = dto.active === 'true';
    }

    if (dto.orderBy) {
      order[dto.orderBy] = dto.ordering ?? 'ASC';
    } else {
      order.price = 'ASC';
    }

    const { take, skip } = dto;

    const [data, total] = await this.ticketTypeRepository.manager.findAndCount({
      where,
      order,
      take,
      skip,
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    return { data, total, pages };
  }
}
