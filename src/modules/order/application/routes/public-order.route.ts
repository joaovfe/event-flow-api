import { Body, Param } from '@nestjs/common';
import { UUID } from 'crypto';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { CheckoutDTO } from '@modules/order/domain/dtos/checkout.dto';
import { ValidateCartDTO } from '@modules/order/domain/dtos/validate-cart.dto';
import { OrderController } from '@modules/order/application/decorators/order-controller.decorator';
import { OrderService } from '@modules/order/domain/services/order.service';

@OrderController.public()
export class PublicOrderController {
  public constructor(private readonly service: OrderService) {}

  @Endpoint.post({
    url: '/validate-cart',
    description: 'Validar o carrinho (preços e disponibilidade) no servidor',
    dtoName: 'ValidateCartDTO',
    withoutLogin: true,
    responses: [
      { description: 'Carrinho validado', status: 200 },
    ],
  })
  public async validateCart(@Body() dto: ValidateCartDTO) {
    return await this.service.validateCart.execute({ dto });
  }

  @Endpoint.post({
    url: '/checkout',
    description: 'Finalizar a compra (checkout fake) e gerar os ingressos',
    dtoName: 'CheckoutDTO',
    withoutLogin: true,
    responses: [
      {
        description: 'Pedido criado e ingressos gerados com sucesso',
        status: 200,
        response: OrderEntity,
      },
      { description: 'Erro de validação / indisponibilidade', status: 412 },
    ],
  })
  public async checkout(@Body() dto: CheckoutDTO) {
    return await this.service.checkout.execute({ dto });
  }

  @Endpoint.get({
    url: '/:uuid',
    description: 'Buscar um pedido público pelo seu UUID (página de sucesso)',
    withoutLogin: true,
    responses: [
      { description: 'Dados do pedido', status: 200, response: OrderEntity },
      { description: 'Pedido não encontrado', status: 404 },
    ],
  })
  public async findPublic(@Param('uuid') uuid: UUID) {
    return await this.service.findPublic.execute({ uuid });
  }
}
