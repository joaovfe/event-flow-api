import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { NumericTransformer } from '@core/database/domain/transformers/numeric.transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { TicketEntity } from '@modules/ticket/domain/entities/ticket.entity';

import { EOrderStatus } from '../enums/order-status.enum';

@EntityTable('orders', 'Tabela para armazenar os pedidos de compra de ingressos')
export class OrderEntity extends BaseEntity {
  @ColumnEntity({
    name: 'customer_name',
    type: 'varchar',
    length: 150,
    example: 'João da Silva',
    description: 'Nome do cliente que realizou a compra',
  })
  public customerName: string;

  @ColumnEntity({
    name: 'customer_email',
    type: 'varchar',
    length: 256,
    example: 'joao@email.com',
    description: 'Email do cliente que realizou a compra',
  })
  public customerEmail: string;

  @ColumnEntity({
    name: 'customer_document',
    type: 'varchar',
    length: 14,
    nullable: true,
    example: '123.456.789-00',
    description: 'CPF do cliente (opcional)',
  })
  public customerDocument?: string;

  @ColumnEntity({
    name: 'total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
    example: 300.0,
    description: 'Valor total do pedido',
  })
  public total: number;

  @ColumnEntity({
    name: 'status',
    type: 'enum',
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
    example: EOrderStatus.PAID,
    description: 'Status do pedido',
  })
  public status: EOrderStatus;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user?: UserEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.order)
  public tickets: Array<TicketEntity>;
}
