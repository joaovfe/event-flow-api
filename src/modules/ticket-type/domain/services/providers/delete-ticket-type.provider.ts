import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';

import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';

export class DeleteTicketTypeProvider {
  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {}

  public async execute({ id }: { id: number }): Promise<MessagePayload> {
    const ticketType = await this.ticketTypeRepository.manager.findOne({
      where: { id },
    });

    if (!ticketType) {
      throw new HttpException('Tipo de ingresso não encontrado', 404);
    }

    if (ticketType.soldQuantity > 0) {
      throw new HttpException(
        'Não é possível deletar um tipo de ingresso que já possui vendas',
        412,
      );
    }

    await this.ticketTypeRepository.manager.softDelete({ id });

    return { message: 'Tipo de ingresso deletado com sucesso' };
  }
}
