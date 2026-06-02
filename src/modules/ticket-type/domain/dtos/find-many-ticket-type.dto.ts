import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';

import { FindManyDTO } from '@shared/dtos/find-many.dto';

export class FindManyTicketTypeDTO extends FindManyDTO {
  @ApiPropertyOptional({ description: 'Filtro por ID do evento' })
  @IsOptional()
  @IsNumberString()
  public eventId?: number;

  @ApiPropertyOptional({ description: 'Filtro por status ativo (true/false)' })
  @IsOptional()
  @IsBooleanString()
  public active?: string;
}
