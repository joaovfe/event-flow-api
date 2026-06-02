import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import { EStatus } from '@shared/enums/status.enum';

export class CreateEventDTO {
  @ApiProperty({
    description: 'Título do evento',
    example: 'Festival Synapse 2026',
  })
  @IsString()
  @IsNotEmpty({ message: 'O título do evento não pode estar vazio' })
  @Length(3, 150, {
    message: 'O título deve conter entre 3 e 150 caracteres',
  })
  public title: string;

  @ApiPropertyOptional({
    description: 'Slug do evento (gerado automaticamente se não informado)',
    example: 'festival-synapse-2026',
  })
  @IsString()
  @IsOptional()
  @MaxLength(180)
  public slug?: string;

  @ApiProperty({
    description: 'Descrição completa do evento',
    example: 'O maior festival de tecnologia e música do ano.',
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição do evento não pode estar vazia' })
  public description: string;

  @ApiPropertyOptional({
    description: 'URL do banner/imagem do evento',
    example: 'https://cdn.eventflow.com/events/banner.jpg',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  public image?: string;

  @ApiProperty({
    description: 'Local onde o evento será realizado',
    example: 'Arena Synapse - São Paulo, SP',
  })
  @IsString()
  @IsNotEmpty({ message: 'O local do evento não pode estar vazio' })
  @MaxLength(255)
  public location: string;

  @ApiProperty({
    description: 'Data e hora de início do evento',
    example: '2026-08-15T20:00:00.000Z',
  })
  @IsDateString(
    {},
    { message: 'A data de início deve ser uma data válida' },
  )
  public startDate: Date;

  @ApiProperty({
    description: 'Data e hora de término do evento',
    example: '2026-08-15T23:59:00.000Z',
  })
  @IsDateString(
    {},
    { message: 'A data de término deve ser uma data válida' },
  )
  public endDate: Date;

  @ApiPropertyOptional({
    description: 'Status do evento',
    enum: EStatus,
    example: EStatus.ACTIVE,
  })
  @IsEnum(EStatus)
  @IsOptional()
  public status?: EStatus;
}
