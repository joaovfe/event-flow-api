import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketModule } from '@modules/ticket/ticket.module';
import { TicketTypeModule } from '@modules/ticket-type/ticket-type.module';

import { OrderControllers } from './application/controllers/order.controller';
import { OrderRepository } from './domain/repositories/order.repository';
import { OrderEntity } from './domain/entities/order.entity';
import { OrderService } from './domain/services/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    TicketModule,
    TicketTypeModule,
  ],
  providers: [OrderRepository, OrderService],
  controllers: [...OrderControllers],
  exports: [OrderRepository],
})
export class OrderModule {}
