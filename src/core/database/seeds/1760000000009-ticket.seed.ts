import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { TicketEntity } from '@modules/ticket/domain/entities/ticket.entity';
import { ETicketStatus } from '@modules/ticket/domain/enums/ticket-status.enum';
import { QrCodeHelper } from '@modules/ticket/domain/helpers/qr-code.helper';

const SEED_MARKER = '@seed.eventflow.local';

/** Códigos fixos para testar check-in no frontend sem adivinhar */
const SEED_TICKET_CODES = {
  JOAO_PISTA_1: 'EVF-SEED000001',
  JOAO_PISTA_2: 'EVF-SEED000002',
  MARIA_VIP: 'EVF-SEED000003',
  ANA_PISTA: 'EVF-SEED000004',
} as const;

type SeedTicket = {
  orderEmail: string;
  eventSlug: string;
  ticketTypeName: string;
  code: string;
  status: ETicketStatus;
  usedAt?: Date;
};

const SEED_TICKETS: Array<SeedTicket> = [
  {
    orderEmail: `joao.silva${SEED_MARKER}`,
    eventSlug: 'festival-synapse-2026',
    ticketTypeName: 'Pista',
    code: SEED_TICKET_CODES.JOAO_PISTA_1,
    status: ETicketStatus.VALID,
  },
  {
    orderEmail: `joao.silva${SEED_MARKER}`,
    eventSlug: 'festival-synapse-2026',
    ticketTypeName: 'Pista',
    code: SEED_TICKET_CODES.JOAO_PISTA_2,
    status: ETicketStatus.VALID,
  },
  {
    orderEmail: `maria.santos${SEED_MARKER}`,
    eventSlug: 'festival-synapse-2026',
    ticketTypeName: 'VIP',
    code: SEED_TICKET_CODES.MARIA_VIP,
    status: ETicketStatus.USED,
    usedAt: new Date('2026-03-01T18:30:00.000Z'),
  },
  {
    orderEmail: `ana.costa${SEED_MARKER}`,
    eventSlug: 'festival-synapse-2026',
    ticketTypeName: 'Pista',
    code: SEED_TICKET_CODES.ANA_PISTA,
    status: ETicketStatus.CANCELLED,
  },
];

export class TicketSeed1760000000009 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const ticketRepository = dataSource.getRepository(TicketEntity);
    const orderRepository = dataSource.getRepository(OrderEntity);
    const eventRepository = dataSource.getRepository(EventEntity);
    const ticketTypeRepository = dataSource.getRepository(TicketTypeEntity);

    const seedCodes = SEED_TICKETS.map((ticket) => ticket.code);
    const existing = await ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.code IN (:...codes)', { codes: seedCodes })
      .getMany();

    if (existing.length >= SEED_TICKETS.length) {
      console.log('Seed de ticket executada anteriormente.');
      return;
    }

    const existingCodes = new Set(existing.map((ticket) => ticket.code));

    const orders = await orderRepository
      .createQueryBuilder('order')
      .where('order.customer_email LIKE :pattern', { pattern: `%${SEED_MARKER}` })
      .getMany();
    const ordersByEmail = new Map(orders.map((order) => [order.customerEmail, order]));

    const events = await eventRepository.find();
    const eventsBySlug = new Map(events.map((event) => [event.slug, event]));

    const ticketTypes = await ticketTypeRepository.find({ relations: ['event'] });
    const ticketTypesByKey = new Map(
      ticketTypes.map((tt) => [`${tt.event?.slug}:${tt.name}`, tt]),
    );

    const soldQuantityDelta = new Map<number, number>();
    const toInsert: Array<TicketEntity> = [];

    for (const seed of SEED_TICKETS) {
      if (existingCodes.has(seed.code)) {
        continue;
      }

      const order = ordersByEmail.get(seed.orderEmail);
      const event = eventsBySlug.get(seed.eventSlug);
      const ticketType = ticketTypesByKey.get(`${seed.eventSlug}:${seed.ticketTypeName}`);

      if (!order || !event || !ticketType) {
        console.warn(
          `Seed ticket: dependência ausente para código ${seed.code}, pulando.`,
        );
        continue;
      }

      const qrCode = await QrCodeHelper.generate(seed.code);

      toInsert.push(
        ticketRepository.create({
          code: seed.code,
          qrCode,
          status: seed.status,
          usedAt: seed.usedAt,
          order,
          event,
          ticketType,
        }),
      );

      if (seed.status !== ETicketStatus.CANCELLED) {
        const current = soldQuantityDelta.get(ticketType.id!) ?? 0;
        soldQuantityDelta.set(ticketType.id!, current + 1);
      }
    }

    if (toInsert.length === 0) {
      console.log('Seed de ticket executada anteriormente.');
      return;
    }

    await ticketRepository.save(toInsert);

    for (const [ticketTypeId, delta] of soldQuantityDelta) {
      const ticketType = ticketTypes.find((tt) => tt.id === ticketTypeId);

      if (ticketType) {
        ticketType.soldQuantity = (ticketType.soldQuantity ?? 0) + delta;
        await ticketTypeRepository.save(ticketType);
      }
    }

    console.log(`Seed de ticket executada com sucesso! (${toInsert.length} ingresso(s))`);
    console.log('Códigos para check-in:', Object.values(SEED_TICKET_CODES).join(', '));
  }
}
