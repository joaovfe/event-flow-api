import { Injectable } from '@nestjs/common';

import { GenerateTicketsProvider } from './providers/generate-tickets.provider';

@Injectable()
export class TicketService {
  public generate: GenerateTicketsProvider;

  public constructor() {
    this.generate = new GenerateTicketsProvider();
  }
}
