import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketRepository } from './domain/repositories/ticket.repository';
import { TicketEntity } from './domain/entities/ticket.entity';
import { TicketService } from './domain/services/ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity])],
  providers: [TicketRepository, TicketService],
  exports: [TicketRepository, TicketService],
})
export class TicketModule {}
