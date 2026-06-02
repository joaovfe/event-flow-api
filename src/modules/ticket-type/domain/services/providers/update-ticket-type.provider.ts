import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { UpdateTicketTypeDTO } from '@modules/ticket-type/domain/dtos/update-ticket-type.dto';
import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';

export class UpdateTicketTypeProvider {
  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {}

  public async execute(params: {
    id: number;
    data: UpdateTicketTypeDTO;
  }): Promise<TicketTypeEntity> {
    const ticketType = await this.ticketTypeRepository.manager.findOne({
      where: { id: params.id },
    });

    if (!ticketType) {
      throw new HttpException('Tipo de ingresso não encontrado', 404);
    }

    if (
      params.data.quantity !== undefined &&
      params.data.quantity < ticketType.soldQuantity
    ) {
      throw new HttpException(
        'A quantidade não pode ser menor do que a já vendida',
        412,
      );
    }

    const updated = plainToInstance(
      TicketTypeEntity,
      { ...ticketType, ...params.data },
      { ignoreDecorators: true },
    );

    return await this.ticketTypeRepository.manager.save(updated);
  }
}
