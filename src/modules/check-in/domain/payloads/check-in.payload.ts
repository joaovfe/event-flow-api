import { ApiProperty } from '@nestjs/swagger';

import { TicketEntity } from '@modules/ticket/domain/entities/ticket.entity';
import { ECheckInResult } from '../enums/check-in-result.enum';

export class CheckInPayload {
  @ApiProperty({
    description: 'Resultado da validação do ingresso',
    enum: ECheckInResult,
  })
  public result: ECheckInResult;

  @ApiProperty({ description: 'Mensagem amigável sobre o resultado' })
  public message: string;

  @ApiProperty({ description: 'Dados do ingresso validado' })
  public ticket: TicketEntity;
}
