import { HttpException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { EStatus } from '@shared/enums/status.enum';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { TicketService } from '@modules/ticket/domain/services/ticket.service';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { EOrderStatus } from '@modules/order/domain/enums/order-status.enum';
import { CheckoutDTO } from '@modules/order/domain/dtos/checkout.dto';
import { OrderRepository } from '@modules/order/domain/repositories/order.repository';

export class CheckoutProvider {
  public constructor(
    private readonly orderRepository: OrderRepository,
    private readonly ticketService: TicketService,
  ) {}

  public async execute({
    dto,
    user,
  }: {
    dto: CheckoutDTO;
    user: UserEntity;
  }): Promise<OrderEntity> {
    return await this.orderRepository.transaction(async (queryRunner) => {
      const lines = await this.resolveLines(dto, queryRunner);

      const total = lines.reduce(
        (sum, line) => sum + line.ticketType.price * line.quantity,
        0,
      );

      const order = await queryRunner.manager.save(OrderEntity, {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerDocument: dto.customerDocument,
        total,
        user,
        // Checkout fake: o pagamento é sempre aprovado.
        status: EOrderStatus.PAID,
      });

      for (const line of lines) {
        await queryRunner.manager.update(
          TicketTypeEntity,
          { id: line.ticketType.id },
          { soldQuantity: line.ticketType.soldQuantity + line.quantity },
        );

        await this.ticketService.generate.execute({
          queryRunner,
          order,
          event: line.event,
          ticketType: line.ticketType,
          quantity: line.quantity,
        });
      }

      return await queryRunner.manager.findOne(OrderEntity, {
        where: { id: order.id },
        relations: ['tickets', 'tickets.event', 'tickets.ticketType'],
      });
    });
  }

  private async resolveLines(dto: CheckoutDTO, queryRunner: QueryRunner) {
    const lines: Array<{
      ticketType: TicketTypeEntity;
      event: EventEntity;
      quantity: number;
    }> = [];

    for (const item of dto.items) {
      const ticketType = await queryRunner.manager.findOne(TicketTypeEntity, {
        where: { id: item.ticketTypeId },
        relations: ['event'],
      });

      if (!ticketType) {
        throw new HttpException(
          `Tipo de ingresso ${item.ticketTypeId} não encontrado`,
          404,
        );
      }

      if (!ticketType.active) {
        throw new HttpException(
          `O ingresso "${ticketType.name}" não está disponível para venda`,
          412,
        );
      }

      if (!ticketType.event || ticketType.event.status !== EStatus.ACTIVE) {
        throw new HttpException(
          `O evento do ingresso "${ticketType.name}" não está disponível`,
          412,
        );
      }

      const available = ticketType.quantity - ticketType.soldQuantity;

      if (item.quantity > available) {
        throw new HttpException(
          `Quantidade indisponível para o ingresso "${ticketType.name}". Restam ${available}.`,
          412,
        );
      }

      lines.push({ ticketType, event: ticketType.event, quantity: item.quantity });
    }

    return lines;
  }
}
