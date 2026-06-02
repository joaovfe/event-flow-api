import { HttpException } from '@nestjs/common';

import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { OrderRepository } from '@modules/order/domain/repositories/order.repository';

export class FindOneOrderProvider {
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute({ id }: { id: number }): Promise<OrderEntity> {
    const order = await this.orderRepository.manager.findOne({
      where: { id },
      relations: ['tickets', 'tickets.event', 'tickets.ticketType', 'user'],
    });

    if (order) return order;

    throw new HttpException('Pedido não encontrado', 404);
  }
}
