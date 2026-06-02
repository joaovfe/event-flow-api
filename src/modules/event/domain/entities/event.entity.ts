import { OneToMany } from 'typeorm';

import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';

import { EStatus } from '@shared/enums/status.enum';

import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';

@EntityTable('events', 'Tabela para armazenar os eventos da plataforma')
export class EventEntity extends BaseEntity {
  @ColumnEntity({
    name: 'title',
    type: 'varchar',
    length: 150,
    example: 'Festival Synapse 2026',
    description: 'Título do evento',
  })
  public title: string;

  @ColumnEntity({
    name: 'slug',
    type: 'varchar',
    length: 180,
    unique: true,
    example: 'festival-synapse-2026',
    description: 'Identificador amigável do evento utilizado nas URLs públicas',
  })
  public slug: string;

  @ColumnEntity({
    name: 'description',
    type: 'text',
    example: 'O maior festival de tecnologia e música do ano.',
    description: 'Descrição completa do evento',
  })
  public description: string;

  @ColumnEntity({
    name: 'image',
    type: 'varchar',
    length: 500,
    nullable: true,
    example: 'https://cdn.eventflow.com/events/banner.jpg',
    description: 'URL do banner/imagem do evento',
  })
  public image?: string;

  @ColumnEntity({
    name: 'location',
    type: 'varchar',
    length: 255,
    example: 'Arena Synapse - São Paulo, SP',
    description: 'Local onde o evento será realizado',
  })
  public location: string;

  @ColumnEntity({
    name: 'start_date',
    type: 'timestamp',
    example: '2026-08-15T20:00:00.000Z',
    description: 'Data e hora de início do evento',
  })
  public startDate: Date;

  @ColumnEntity({
    name: 'end_date',
    type: 'timestamp',
    example: '2026-08-15T23:59:00.000Z',
    description: 'Data e hora de término do evento',
  })
  public endDate: Date;

  @ColumnEntity({
    name: 'status',
    type: 'enum',
    enum: EStatus,
    default: EStatus.ACTIVE,
    example: EStatus.ACTIVE,
    description: 'Status do evento (ativo/inativo)',
  })
  public status: EStatus;

  @OneToMany(() => TicketTypeEntity, (ticketType) => ticketType.event)
  public ticketTypes: Array<TicketTypeEntity>;
}
