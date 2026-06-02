import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { NumericTransformer } from '@core/database/domain/transformers/numeric.transformer';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { TicketEntity } from '@modules/ticket/domain/entities/ticket.entity';

@EntityTable(
  'ticket_types',
  'Tabela para armazenar os tipos de ingresso de cada evento',
)
export class TicketTypeEntity extends BaseEntity {
  @ColumnEntity({
    name: 'name',
    type: 'varchar',
    length: 100,
    example: 'Pista',
    description: 'Nome do tipo de ingresso (ex: Pista, VIP, Camarote)',
  })
  public name: string;

  @ColumnEntity({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: true,
    example: 'Acesso à área da pista comum',
    description: 'Descrição do tipo de ingresso',
  })
  public description?: string;

  @ColumnEntity({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
    example: 150.0,
    description: 'Preço unitário do ingresso',
  })
  public price: number;

  @ColumnEntity({
    name: 'quantity',
    type: 'int',
    example: 500,
    description: 'Quantidade total de ingressos disponíveis deste tipo',
  })
  public quantity: number;

  @ColumnEntity({
    name: 'sold_quantity',
    type: 'int',
    default: 0,
    example: 0,
    description: 'Quantidade de ingressos já vendidos deste tipo',
  })
  public soldQuantity: number;

  @ColumnEntity({
    name: 'active',
    type: 'boolean',
    default: true,
    example: true,
    description: 'Se o tipo de ingresso está ativo para venda',
  })
  public active: boolean;

  @ManyToOne(() => EventEntity, (event) => event.ticketTypes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  public event: EventEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.ticketType)
  public tickets: Array<TicketEntity>;
}
