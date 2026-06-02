import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { EStatus } from '@shared/enums/status.enum';

export class FindManyEventDTO extends FindManyDTO {
  @ApiPropertyOptional({
    description: 'Filtro por título ou local do evento',
  })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por status do evento',
    enum: EStatus,
  })
  @IsOptional()
  @IsEnum(EStatus)
  public status?: EStatus;
}
