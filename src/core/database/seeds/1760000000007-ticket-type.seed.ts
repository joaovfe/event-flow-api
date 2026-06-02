import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';

type SeedTicketType = {
  eventSlug: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
};

const SEED_TICKET_TYPES: Array<SeedTicketType> = [
  {
    eventSlug: 'festival-synapse-2026',
    name: 'Pista',
    description: 'Acesso à área da pista comum',
    price: 150,
    quantity: 500,
  },
  {
    eventSlug: 'festival-synapse-2026',
    name: 'VIP',
    description: 'Área VIP com open bar e lounge exclusivo',
    price: 350,
    quantity: 100,
  },
  {
    eventSlug: 'festival-synapse-2026',
    name: 'Camarote',
    description: 'Camarote premium com vista privilegiada',
    price: 800,
    quantity: 50,
  },
  {
    eventSlug: 'tech-meetup-eventflow',
    name: 'Entrada geral',
    description: 'Acesso completo ao meetup e coffee break',
    price: 49.9,
    quantity: 200,
  },
  {
    eventSlug: 'workshop-design-systems',
    name: 'Presencial',
    description: 'Vaga presencial com material impresso',
    price: 120,
    quantity: 30,
  },
  {
    eventSlug: 'workshop-design-systems',
    name: 'Online',
    description: 'Transmissão ao vivo + gravação por 30 dias',
    price: 60,
    quantity: 100,
  },
];

export class TicketTypeSeed1760000000007 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const eventRepository = dataSource.getRepository(EventEntity);
    const ticketTypeRepository = dataSource.getRepository(TicketTypeEntity);

    const events = await eventRepository.find();
    const eventsBySlug = new Map(events.map((event) => [event.slug, event]));

    const existing = await ticketTypeRepository.find({ relations: ['event'] });
    const existingKeys = new Set(
      existing.map((tt) => `${tt.event?.slug}:${tt.name}`),
    );

    const toInsert: Array<TicketTypeEntity> = [];

    for (const seed of SEED_TICKET_TYPES) {
      const key = `${seed.eventSlug}:${seed.name}`;

      if (existingKeys.has(key)) {
        continue;
      }

      const event = eventsBySlug.get(seed.eventSlug);

      if (!event) {
        console.warn(
          `Seed ticket-type: evento "${seed.eventSlug}" não encontrado, pulando "${seed.name}".`,
        );
        continue;
      }

      toInsert.push(
        ticketTypeRepository.create({
          name: seed.name,
          description: seed.description,
          price: seed.price,
          quantity: seed.quantity,
          soldQuantity: 0,
          active: true,
          event,
        }),
      );
    }

    if (toInsert.length === 0) {
      console.log('Seed de ticket-type executada anteriormente.');
      return;
    }

    await ticketTypeRepository.save(toInsert);

    console.log(
      `Seed de ticket-type executada com sucesso! (${toInsert.length} tipo(s))`,
    );
  }
}
