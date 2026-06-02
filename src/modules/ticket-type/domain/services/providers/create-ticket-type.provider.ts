import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { EventRepository } from '@modules/event/domain/repositories/event.repository';

import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { CreateTicketTypeDTO } from '@modules/ticket-type/domain/dtos/create-ticket-type.dto';
import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';

export class CreateTicketTypeProvider {
  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  public async execute({
    dto,
  }: {
    dto: CreateTicketTypeDTO;
  }): Promise<TicketTypeEntity> {
    const event = await this.eventRepository.manager.findOne({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new HttpException('Evento não encontrado', 404);
    }

    const ticketType = plainToInstance(
      TicketTypeEntity,
      {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        soldQuantity: 0,
        active: dto.active ?? true,
        event,
      },
      { ignoreDecorators: true },
    );

    return await this.ticketTypeRepository.manager.save(ticketType);
  }
}
