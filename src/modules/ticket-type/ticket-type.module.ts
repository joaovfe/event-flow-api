import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventModule } from '@modules/event/event.module';

import { TicketTypeControllers } from './application/controllers/ticket-type.controller';
import { TicketTypeRepository } from './domain/repositories/ticket-type.repository';
import { TicketTypeEntity } from './domain/entities/ticket-type.entity';
import { TicketTypeService } from './domain/services/ticket-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTypeEntity]), EventModule],
  providers: [TicketTypeRepository, TicketTypeService],
  controllers: [...TicketTypeControllers],
  exports: [TicketTypeRepository],
})
export class TicketTypeModule {}
