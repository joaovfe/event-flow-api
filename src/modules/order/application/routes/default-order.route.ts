import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { CheckoutDTO } from '@modules/order/domain/dtos/checkout.dto';
import { FindManyOrderDTO } from '@modules/order/domain/dtos/find-many-order.dto';
import { OrderController } from '@modules/order/application/decorators/order-controller.decorator';
import { OrderService } from '@modules/order/domain/services/order.service';

@OrderController.default()
export class DefaultOrderController {
  public constructor(private readonly service: OrderService) {}

  @Endpoint.post({
    url: '/checkout',
    description: 'Finalizar a compra (checkout fake) e gerar os ingressos',
    dtoName: 'CheckoutDTO',
    responses: [
      {
        description: 'Pedido criado e ingressos gerados com sucesso',
        status: 200,
        response: OrderEntity,
      },
      { description: 'Erro de validação / indisponibilidade', status: 412 },
    ],
  })
  public async checkout(@Body() dto: CheckoutDTO, @AuthUser() user: UserEntity) {
    return await this.service.checkout.execute({ dto, user });
  }

  @Endpoint.get({
    url: '/',
    description: 'Listar pedidos (administração)',
    dtoName: 'FindManyOrderDTO',
    abilities: ['ORDERS'],
    actions: ['READ'],
    responses: [
      {
        description: 'Listagem dos pedidos',
        status: 200,
        findManyModel: OrderEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyOrderDTO) {
    return await this.service.findMany.execute({ dto });
  }

  @Endpoint.get({
    url: '/:id',
    description: 'Buscar um pedido pelo ID, com os ingressos gerados',
    abilities: ['ORDERS'],
    actions: ['READ'],
    responses: [
      { description: 'Dados do pedido', status: 200, response: OrderEntity },
      { description: 'Pedido não encontrado', status: 404 },
    ],
  })
  public async findOne(@Param('id') id: number) {
    return await this.service.findOne.execute({ id });
  }
}
