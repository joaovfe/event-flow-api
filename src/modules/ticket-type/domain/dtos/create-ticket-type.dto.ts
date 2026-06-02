import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTicketTypeDTO {
  @ApiProperty({ description: 'ID do evento ao qual o ingresso pertence', example: 1 })
  @IsInt()
  public eventId: number;

  @ApiProperty({ description: 'Nome do tipo de ingresso', example: 'VIP' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do tipo de ingresso não pode estar vazio' })
  @Length(2, 100)
  public name: string;

  @ApiPropertyOptional({
    description: 'Descrição do tipo de ingresso',
    example: 'Acesso à área VIP com open bar',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  public description?: string;

  @ApiProperty({ description: 'Preço unitário do ingresso', example: 250.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  public price: number;

  @ApiProperty({ description: 'Quantidade total disponível', example: 200 })
  @IsInt()
  @Min(1)
  public quantity: number;

  @ApiPropertyOptional({ description: 'Se o ingresso está ativo', example: true })
  @IsBoolean()
  @IsOptional()
  public active?: boolean;
}
