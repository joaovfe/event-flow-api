import { Injectable } from '@nestjs/common';

import { TicketService } from '@modules/ticket/domain/services/ticket.service';
import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';

import { OrderRepository } from '../repositories/order.repository';

import { CheckoutProvider } from './providers/checkout.provider';
import { FindOneOrderProvider } from './providers/find-one-order.provider';
import { FindManyOrderProvider } from './providers/find-many-order.provider';
import { FindPublicOrderProvider } from './providers/find-public-order.provider';
import { ValidateCartProvider } from './providers/validate-cart.provider';

@Injectable()
export class OrderService {
  public checkout: CheckoutProvider;
  public findOne: FindOneOrderProvider;
  public findMany: FindManyOrderProvider;
  public findPublic: FindPublicOrderProvider;
  public validateCart: ValidateCartProvider;

  public constructor(
    private readonly orderRepository: OrderRepository,
    private readonly ticketService: TicketService,
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {
    this.checkout = new CheckoutProvider(
      this.orderRepository,
      this.ticketService,
    );
    this.findOne = new FindOneOrderProvider(this.orderRepository);
    this.findMany = new FindManyOrderProvider(this.orderRepository);
    this.findPublic = new FindPublicOrderProvider(this.orderRepository);
    this.validateCart = new ValidateCartProvider(this.ticketTypeRepository);
  }
}
