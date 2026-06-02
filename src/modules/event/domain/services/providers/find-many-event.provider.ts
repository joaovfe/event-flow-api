import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

import { FindManyEventDTO } from '@modules/event/domain/dtos/find-many-event.dto';
import { EventRepository } from '@modules/event/domain/repositories/event.repository';
import { EventEntity } from '@modules/event/domain/entities/event.entity';

export class FindManyEventProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute({ dto }: { dto: FindManyEventDTO }) {
    let where: Array<FindOptionsWhere<EventEntity>> = [{}];
    const order: FindOptionsOrder<EventEntity> = {};

    if (dto.status) {
      where[0].status = dto.status;
    }

    if (dto.search) {
      where = [
        { ...where[0], title: ILike(`%${dto.search}%`) },
        { ...where[0], location: ILike(`%${dto.search}%`) },
      ];
    }

    if (dto.orderBy) {
      order[dto.orderBy] = dto.ordering ?? 'ASC';
    } else {
      order.startDate = 'DESC';
    }

    const { take, skip } = dto;

    const [data, total] = await this.eventRepository.manager.findAndCount({
      where,
      order,
      take,
      skip,
      relations: ['ticketTypes'],
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    return { data, total, pages };
  }
}
