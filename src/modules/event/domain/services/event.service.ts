import { Injectable } from '@nestjs/common';

import { EventRepository } from '../repositories/event.repository';

import { CreateEventProvider } from './providers/create-event.provider';
import { UpdateEventProvider } from './providers/update-event.provider';
import { DeleteEventProvider } from './providers/delete-event.provider';
import { FindOneEventProvider } from './providers/find-one-event.provider';
import { FindManyEventProvider } from './providers/find-many-event.provider';
import { ToggleEventStatusProvider } from './providers/toggle-event-status.provider';
import { FindPublicEventsProvider } from './providers/find-public-events.provider';
import { FindPublicEventProvider } from './providers/find-public-event.provider';

@Injectable()
export class EventService {
  public create: CreateEventProvider;
  public update: UpdateEventProvider;
  public delete: DeleteEventProvider;
  public findOne: FindOneEventProvider;
  public findMany: FindManyEventProvider;
  public toggleStatus: ToggleEventStatusProvider;
  public findPublicMany: FindPublicEventsProvider;
  public findPublicOne: FindPublicEventProvider;

  public constructor(private readonly eventRepository: EventRepository) {
    this.create = new CreateEventProvider(this.eventRepository);
    this.update = new UpdateEventProvider(this.eventRepository);
    this.delete = new DeleteEventProvider(this.eventRepository);
    this.findOne = new FindOneEventProvider(this.eventRepository);
    this.findMany = new FindManyEventProvider(this.eventRepository);
    this.toggleStatus = new ToggleEventStatusProvider(this.eventRepository);
    this.findPublicMany = new FindPublicEventsProvider(this.eventRepository);
    this.findPublicOne = new FindPublicEventProvider(this.eventRepository);
  }
}
