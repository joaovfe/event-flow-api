import { HttpException } from '@nestjs/common';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { EventRepository } from '@modules/event/domain/repositories/event.repository';

export class FindOneEventProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute({ id }: { id: number }): Promise<EventEntity> {
    const event = await this.eventRepository.manager.findOne({
      where: { id },
      relations: ['ticketTypes'],
      order: { ticketTypes: { price: 'ASC' } },
    });

    if (event) return event;

    throw new HttpException('Evento não encontrado', 404);
  }
}
