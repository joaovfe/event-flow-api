import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

import { FindManyOrderDTO } from '@modules/order/domain/dtos/find-many-order.dto';
import { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { OrderEntity } from '@modules/order/domain/entities/order.entity';

export class FindManyOrderProvider {
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute({ dto }: { dto: FindManyOrderDTO }) {
    let where: Array<FindOptionsWhere<OrderEntity>> = [{}];
    const order: FindOptionsOrder<OrderEntity> = {};

    if (dto.status) {
      where[0].status = dto.status;
    }

    if (dto.search) {
      where = [
        { ...where[0], customerName: ILike(`%${dto.search}%`) },
        { ...where[0], customerEmail: ILike(`%${dto.search}%`) },
      ];
    }

    if (dto.orderBy) {
      order[dto.orderBy] = dto.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = dto;

    const [data, total] = await this.orderRepository.manager.findAndCount({
      where,
      order,
      take,
      skip,
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    return { data, total, pages };
  }
}
