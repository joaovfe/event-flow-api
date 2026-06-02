import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CheckoutItemDTO } from './checkout-item.dto';

export class CheckoutDTO {
  @ApiProperty({ description: 'Nome do cliente', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente não pode estar vazio' })
  @Length(2, 150)
  public customerName: string;

  @ApiProperty({ description: 'Email do cliente', example: 'joao@email.com' })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @MaxLength(256)
  public customerEmail: string;

  @ApiPropertyOptional({ description: 'CPF do cliente (opcional)', example: '123.456.789-00' })
  @IsString()
  @IsOptional()
  @MaxLength(14)
  public customerDocument?: string;

  @ApiProperty({
    description: 'Itens do carrinho',
    type: [CheckoutItemDTO],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'O carrinho deve conter ao menos um ingresso' })
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDTO)
  public items: Array<CheckoutItemDTO>;
}
