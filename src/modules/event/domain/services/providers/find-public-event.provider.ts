import { HttpException } from '@nestjs/common';

import { EStatus } from '@shared/enums/status.enum';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { EventRepository } from '@modules/event/domain/repositories/event.repository';

export class FindPublicEventProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute({ slug }: { slug: string }): Promise<EventEntity> {
    const event = await this.eventRepository.manager.findOne({
      where: { slug, status: EStatus.ACTIVE },
      relations: ['ticketTypes'],
      order: { ticketTypes: { price: 'ASC' } },
    });

    if (!event) {
      throw new HttpException('Evento não encontrado', 404);
    }

    event.ticketTypes = (event.ticketTypes ?? []).filter(
      (ticketType) => ticketType.active,
    );

    return event;
  }
}
