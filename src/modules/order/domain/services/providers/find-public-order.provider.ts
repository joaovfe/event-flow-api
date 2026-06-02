import { HttpException } from '@nestjs/common';
import { UUID } from 'crypto';

import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { OrderRepository } from '@modules/order/domain/repositories/order.repository';

export class FindPublicOrderProvider {
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute({ uuid }: { uuid: UUID }): Promise<OrderEntity> {
    const order = await this.orderRepository.manager.findOne({
      where: { uuid },
      relations: ['tickets', 'tickets.event', 'tickets.ticketType'],
    });

    if (order) return order;

    throw new HttpException('Pedido não encontrado', 404);
  }
}
