import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { CheckoutItemDTO } from './checkout-item.dto';

export class ValidateCartDTO {
  @ApiProperty({ description: 'Itens do carrinho', type: [CheckoutItemDTO] })
  @IsArray()
  @ArrayMinSize(1, { message: 'O carrinho deve conter ao menos um ingresso' })
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDTO)
  public items: Array<CheckoutItemDTO>;
}
