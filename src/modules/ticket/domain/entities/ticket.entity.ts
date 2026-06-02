import { JoinColumn, ManyToOne } from 'typeorm';

import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { OrderEntity } from '@modules/order/domain/entities/order.entity';
import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';

import { ETicketStatus } from '../enums/ticket-status.enum';

@EntityTable('tickets', 'Tabela para armazenar os ingressos gerados após a compra')
export class TicketEntity extends BaseEntity {
  @ColumnEntity({
    name: 'code',
    type: 'varchar',
    length: 64,
    unique: true,
    example: 'EVF-3F9A1C2B7D',
    description: 'Código único do ingresso, usado na validação de entrada',
  })
  public code: string;

  @ColumnEntity({
    name: 'qr_code',
    type: 'text',
    description: 'QR Code do ingresso codificado como data-URL (imagem base64)',
  })
  public qrCode: string;

  @ColumnEntity({
    name: 'status',
    type: 'enum',
    enum: ETicketStatus,
    default: ETicketStatus.VALID,
    example: ETicketStatus.VALID,
    description: 'Status do ingresso',
  })
  public status: ETicketStatus;

  @ColumnEntity({
    name: 'used_at',
    type: 'timestamp',
    nullable: true,
    description: 'Data e hora em que o ingresso foi utilizado no check-in',
  })
  public usedAt?: Date;

  @ManyToOne(() => OrderEntity, (order) => order.tickets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  public order: OrderEntity;

  @ManyToOne(() => EventEntity, { nullable: false })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  public event: EventEntity;

  @ManyToOne(() => TicketTypeEntity, (ticketType) => ticketType.tickets, {
    nullable: false,
  })
  @JoinColumn({ name: 'ticket_type_id', referencedColumnName: 'id' })
  public ticketType: TicketTypeEntity;
}
