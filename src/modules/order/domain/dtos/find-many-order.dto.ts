import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { EOrderStatus } from '../enums/order-status.enum';

export class FindManyOrderDTO extends FindManyDTO {
  @ApiPropertyOptional({ description: 'Filtro por nome ou email do cliente' })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({ description: 'Filtro por status do pedido', enum: EOrderStatus })
  @IsOptional()
  @IsEnum(EOrderStatus)
  public status?: EOrderStatus;
}
