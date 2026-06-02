import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckInDTO {
  @ApiProperty({
    description: 'Código do ingresso (lido do QR Code ou digitado)',
    example: 'EVF-3F9A1C2B7D',
  })
  @IsString()
  @IsNotEmpty({ message: 'O código do ingresso é obrigatório' })
  public code: string;
}
