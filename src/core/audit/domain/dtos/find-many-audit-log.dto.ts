import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FindManyDTO } from '@shared/dtos/find-many.dto';

import { EAuditAction } from '../enums/audit-action.enum';
import { EAuditResource } from '../enums/audit-resource.enum';

export class FindManyAuditLogDTO extends FindManyDTO {
  @ApiPropertyOptional({
    description: 'Filtro por texto livre na descrição da ação',
  })
  @IsOptional()
  @IsString()
  public search?: string;

  @ApiPropertyOptional({ description: 'Filtro pela ação realizada' })
  @IsOptional()
  @IsEnum(EAuditAction)
  public action?: EAuditAction;

  @ApiPropertyOptional({
    description: 'Filtro pelo recurso administrativo afetado',
  })
  @IsOptional()
  @IsEnum(EAuditResource)
  public resource?: EAuditResource;
}
