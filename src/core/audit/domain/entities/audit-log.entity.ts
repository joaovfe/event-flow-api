import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';

import { EAuditAction } from '../enums/audit-action.enum';
import { EAuditResource } from '../enums/audit-resource.enum';

@EntityTable(
  'audit_logs',
  'Tabela para armazenar a trilha de auditoria das ações administrativas',
)
export class AuditLogEntity extends BaseEntity {
  @ColumnEntity({
    name: 'action',
    type: 'enum',
    enum: EAuditAction,
    example: EAuditAction.CREATE,
    description: 'Ação realizada (CREATE, READ, UPDATE ou DELETE)',
  })
  public action: EAuditAction;

  @ColumnEntity({
    name: 'resource',
    type: 'enum',
    enum: EAuditResource,
    example: EAuditResource.EVENTS,
    description: 'Recurso administrativo afetado pela ação',
  })
  public resource: EAuditResource;

  @ColumnEntity({
    name: 'description',
    type: 'varchar',
    length: 255,
    example: 'Criar um novo evento',
    description: 'Descrição da ação realizada, extraída da rota',
  })
  public description: string;

  @ColumnEntity({
    name: 'actor_id',
    type: 'int',
    nullable: true,
    example: 1,
    description: 'Código do usuário que realizou a ação',
  })
  public actorId?: number;

  @ColumnEntity({
    name: 'actor_name',
    type: 'varchar',
    length: 50,
    nullable: true,
    example: 'Master',
    description: 'Nome do usuário que realizou a ação no momento da ação',
  })
  public actorName?: string;

  @ColumnEntity({
    name: 'actor_email',
    type: 'varchar',
    length: 256,
    nullable: true,
    example: 'master@email.com',
    description: 'Email do usuário que realizou a ação no momento da ação',
  })
  public actorEmail?: string;

  @ColumnEntity({
    name: 'actor_role',
    type: 'varchar',
    length: 50,
    nullable: true,
    example: 'MASTER',
    description: 'Referência do perfil do usuário no momento da ação',
  })
  public actorRole?: string;

  @ColumnEntity({
    name: 'target_id',
    type: 'varchar',
    length: 100,
    nullable: true,
    example: '42',
    description: 'Identificador do registro afetado pela ação (id ou uuid)',
  })
  public targetId?: string;

  @ColumnEntity({
    name: 'http_method',
    type: 'varchar',
    length: 10,
    example: 'POST',
    description: 'Método HTTP utilizado na requisição',
  })
  public httpMethod: string;

  @ColumnEntity({
    name: 'path',
    type: 'varchar',
    length: 255,
    example: '/api/events',
    description: 'Caminho da rota acessada',
  })
  public path: string;

  @ColumnEntity({
    name: 'status_code',
    type: 'int',
    example: 200,
    description: 'Código de status HTTP retornado pela requisição',
  })
  public statusCode: number;

  @ColumnEntity({
    name: 'success',
    type: 'boolean',
    default: true,
    example: true,
    description: 'Informa se a ação foi concluída com sucesso',
  })
  public success: boolean;

  @ColumnEntity({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
    example: '127.0.0.1',
    description: 'Endereço IP de origem da requisição',
  })
  public ipAddress?: string;

  @ColumnEntity({
    name: 'metadata',
    type: 'jsonb',
    nullable: true,
    example: { params: { id: '1' } },
    description:
      'Parâmetros, query e corpo da requisição (sanitizados, sem dados sensíveis)',
  })
  public metadata?: Record<string, unknown>;
}
