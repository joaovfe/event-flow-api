import { QueryRunner } from 'typeorm';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';

import { TicketEntity } from '@modules/ticket/domain/entities/ticket.entity';
import { ETicketStatus } from '@modules/ticket/domain/enums/ticket-status.enum';
import { TicketCodeHelper } from '@modules/ticket/domain/helpers/ticket-code.helper';
import { QrCodeHelper } from '@modules/ticket/domain/helpers/qr-code.helper';

export class GenerateTicketsProvider {
  /**
   * Gera os ingressos de uma linha do pedido dentro de uma transação.
   * Cada ingresso recebe um código único e um QR Code.
   */
  public async execute(params: {
    queryRunner: QueryRunner;
    order: OrderEntity;
    event: EventEntity;
    ticketType: TicketTypeEntity;
    quantity: number;
  }): Promise<Array<TicketEntity>> {
    const tickets: Array<TicketEntity> = [];

    for (let index = 0; index < params.quantity; index++) {
      const code = await this.generateUniqueCode(params.queryRunner);
      const qrCode = await QrCodeHelper.generate(code);

      const ticket = params.queryRunner.manager.create(TicketEntity, {
        code,
        qrCode,
        status: ETicketStatus.VALID,
        order: params.order,
        event: params.event,
        ticketType: params.ticketType,
      });

      tickets.push(await params.queryRunner.manager.save(TicketEntity, ticket));
    }

    return tickets;
  }

  private async generateUniqueCode(queryRunner: QueryRunner): Promise<string> {
    let code = TicketCodeHelper.generate();

    let exists = await queryRunner.manager.findOne(TicketEntity, {
      where: { code },
    });

    while (exists) {
      code = TicketCodeHelper.generate();
      exists = await queryRunner.manager.findOne(TicketEntity, {
        where: { code },
      });
    }

    return code;
  }
}
