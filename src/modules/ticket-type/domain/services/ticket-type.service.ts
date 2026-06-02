import { Injectable } from '@nestjs/common';

import { EventRepository } from '@modules/event/domain/repositories/event.repository';

import { TicketTypeRepository } from '../repositories/ticket-type.repository';

import { CreateTicketTypeProvider } from './providers/create-ticket-type.provider';
import { UpdateTicketTypeProvider } from './providers/update-ticket-type.provider';
import { DeleteTicketTypeProvider } from './providers/delete-ticket-type.provider';
import { FindOneTicketTypeProvider } from './providers/find-one-ticket-type.provider';
import { FindManyTicketTypeProvider } from './providers/find-many-ticket-type.provider';
import { ToggleTicketTypeActiveProvider } from './providers/toggle-ticket-type-active.provider';

@Injectable()
export class TicketTypeService {
  public create: CreateTicketTypeProvider;
  public update: UpdateTicketTypeProvider;
  public delete: DeleteTicketTypeProvider;
  public findOne: FindOneTicketTypeProvider;
  public findMany: FindManyTicketTypeProvider;
  public toggleActive: ToggleTicketTypeActiveProvider;

  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
    private readonly eventRepository: EventRepository,
  ) {
    this.create = new CreateTicketTypeProvider(
      this.ticketTypeRepository,
      this.eventRepository,
    );
    this.update = new UpdateTicketTypeProvider(this.ticketTypeRepository);
    this.delete = new DeleteTicketTypeProvider(this.ticketTypeRepository);
    this.findOne = new FindOneTicketTypeProvider(this.ticketTypeRepository);
    this.findMany = new FindManyTicketTypeProvider(this.ticketTypeRepository);
    this.toggleActive = new ToggleTicketTypeActiveProvider(
      this.ticketTypeRepository,
    );
  }
}
