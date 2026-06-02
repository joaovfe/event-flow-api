import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CheckoutItemDTO {
  @ApiProperty({ description: 'ID do tipo de ingresso', example: 1 })
  @IsInt()
  public ticketTypeId: number;

  @ApiProperty({ description: 'Quantidade de ingressos deste tipo', example: 2 })
  @IsInt()
  @Min(1)
  public quantity: number;
}
