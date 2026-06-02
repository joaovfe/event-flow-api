import { HttpException } from '@nestjs/common';

import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';

export class FindOneTicketTypeProvider {
  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {}

  public async execute({ id }: { id: number }): Promise<TicketTypeEntity> {
    const ticketType = await this.ticketTypeRepository.manager.findOne({
      where: { id },
      relations: ['event'],
    });

    if (ticketType) return ticketType;

    throw new HttpException('Tipo de ingresso não encontrado', 404);
  }
}
