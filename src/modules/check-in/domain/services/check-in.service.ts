import { Injectable } from '@nestjs/common';

import { TicketRepository } from '@modules/ticket/domain/repositories/ticket.repository';

import { InspectTicketProvider } from './providers/inspect-ticket.provider';
import { CheckInTicketProvider } from './providers/check-in-ticket.provider';

@Injectable()
export class CheckInService {
  public inspect: InspectTicketProvider;
  public checkIn: CheckInTicketProvider;

  public constructor(private readonly ticketRepository: TicketRepository) {
    this.inspect = new InspectTicketProvider(this.ticketRepository);
    this.checkIn = new CheckInTicketProvider(this.ticketRepository);
  }
}
