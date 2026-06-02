import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventControllers } from './application/controllers/event.controller';
import { EventRepository } from './domain/repositories/event.repository';
import { EventEntity } from './domain/entities/event.entity';
import { EventService } from './domain/services/event.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventRepository, EventService],
  controllers: [...EventControllers],
  exports: [EventRepository],
})
export class EventModule {}
