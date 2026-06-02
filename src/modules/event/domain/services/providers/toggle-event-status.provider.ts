import { HttpException } from '@nestjs/common';

import { EStatus } from '@shared/enums/status.enum';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { EventRepository } from '@modules/event/domain/repositories/event.repository';

export class ToggleEventStatusProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute({ id }: { id: number }): Promise<EventEntity> {
    const event = await this.eventRepository.manager.findOne({
      where: { id },
    });

    if (!event) {
      throw new HttpException('Evento não encontrado', 404);
    }

    event.status =
      event.status === EStatus.ACTIVE ? EStatus.INACTIVE : EStatus.ACTIVE;

    return await this.eventRepository.manager.save(event);
  }
}
