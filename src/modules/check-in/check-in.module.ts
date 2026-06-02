import { Module } from '@nestjs/common';

import { TicketModule } from '@modules/ticket/ticket.module';

import { CheckInControllers } from './application/controllers/check-in.controller';
import { CheckInService } from './domain/services/check-in.service';

@Module({
  imports: [TicketModule],
  providers: [CheckInService],
  controllers: [...CheckInControllers],
})
export class CheckInModule {}
