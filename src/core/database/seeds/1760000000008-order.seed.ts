import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { EOrderStatus } from '@modules/order/domain/enums/order-status.enum';

/** E-mail único por pedido seed — usado para idempotência */
const SEED_MARKER = '@seed.eventflow.local';

const SEED_ORDERS: Array<{
  customerName: string;
  customerEmail: string;
  customerDocument?: string;
  total: number;
  status: EOrderStatus;
}> = [
  {
    customerName: 'João da Silva',
    customerEmail: `joao.silva${SEED_MARKER}`,
    customerDocument: '123.456.789-00',
    total: 300,
    status: EOrderStatus.PAID,
  },
  {
    customerName: 'Maria Santos',
    customerEmail: `maria.santos${SEED_MARKER}`,
    customerDocument: '987.654.321-00',
    total: 350,
    status: EOrderStatus.PAID,
  },
  {
    customerName: 'Pedro Oliveira',
    customerEmail: `pedro.oliveira${SEED_MARKER}`,
    total: 49.9,
    status: EOrderStatus.PENDING,
  },
  {
    customerName: 'Ana Costa',
    customerEmail: `ana.costa${SEED_MARKER}`,
    customerDocument: '456.789.123-00',
    total: 150,
    status: EOrderStatus.CANCELLED,
  },
];

export class OrderSeed1760000000008 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(OrderEntity);

    const existing = await repository
      .createQueryBuilder('order')
      .where('order.customer_email LIKE :pattern', {
        pattern: `%${SEED_MARKER}`,
      })
      .getMany();

    if (existing.length >= SEED_ORDERS.length) {
      console.log('Seed de order executada anteriormente.');
      return;
    }

    const existingEmails = new Set(existing.map((order) => order.customerEmail));

    const toInsert = SEED_ORDERS.filter(
      (order) => !existingEmails.has(order.customerEmail),
    ).map((order) => repository.create(order));

    if (toInsert.length === 0) {
      console.log('Seed de order executada anteriormente.');
      return;
    }

    await repository.save(toInsert);

    console.log(`Seed de order executada com sucesso! (${toInsert.length} pedido(s))`);
  }
}
