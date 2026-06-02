import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';

import { EventRepository } from '@modules/event/domain/repositories/event.repository';

export class DeleteEventProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute({ id }: { id: number }): Promise<MessagePayload> {
    const event = await this.eventRepository.manager.findOne({
      where: { id },
    });

    if (!event) {
      throw new HttpException('Evento não encontrado', 404);
    }

    await this.eventRepository.manager.softDelete({ id });

    return { message: 'Evento deletado com sucesso' };
  }
}
