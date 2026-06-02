import { FindOptionsWhere, ILike, MoreThanOrEqual } from 'typeorm';

import { EStatus } from '@shared/enums/status.enum';

import { FindManyEventDTO } from '@modules/event/domain/dtos/find-many-event.dto';
import { EventRepository } from '@modules/event/domain/repositories/event.repository';
import { EventEntity } from '@modules/event/domain/entities/event.entity';

export class FindPublicEventsProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute({ dto }: { dto: FindManyEventDTO }) {
    const base: FindOptionsWhere<EventEntity> = {
      status: EStatus.ACTIVE,
      endDate: MoreThanOrEqual(new Date()),
    };

    let where: Array<FindOptionsWhere<EventEntity>> = [base];

    if (dto.search) {
      where = [
        { ...base, title: ILike(`%${dto.search}%`) },
        { ...base, location: ILike(`%${dto.search}%`) },
      ];
    }

    const { take, skip } = dto;

    const [data, total] = await this.eventRepository.manager.findAndCount({
      where,
      order: { startDate: 'ASC' },
      take,
      skip,
      relations: ['ticketTypes'],
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    return { data, total, pages };
  }
}
