import { HttpException } from '@nestjs/common';

import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';

export class ToggleTicketTypeActiveProvider {
  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {}

  public async execute({ id }: { id: number }): Promise<TicketTypeEntity> {
    const ticketType = await this.ticketTypeRepository.manager.findOne({
      where: { id },
    });

    if (!ticketType) {
      throw new HttpException('Tipo de ingresso não encontrado', 404);
    }

    ticketType.active = !ticketType.active;

    return await this.ticketTypeRepository.manager.save(ticketType);
  }
}
