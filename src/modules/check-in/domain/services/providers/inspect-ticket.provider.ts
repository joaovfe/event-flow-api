import { HttpException } from '@nestjs/common';

import { ETicketStatus } from '@modules/ticket/domain/enums/ticket-status.enum';
import { TicketEntity } from '@modules/ticket/domain/entities/ticket.entity';
import { TicketRepository } from '@modules/ticket/domain/repositories/ticket.repository';

import { ECheckInResult } from '@modules/check-in/domain/enums/check-in-result.enum';
import { CheckInPayload } from '@modules/check-in/domain/payloads/check-in.payload';

export class InspectTicketProvider {
  public constructor(private readonly ticketRepository: TicketRepository) {}

  public async execute({ code }: { code: string }): Promise<CheckInPayload> {
    const ticket = await this.findTicket(code);

    if (ticket.status === ETicketStatus.USED) {
      return {
        result: ECheckInResult.ALREADY_USED,
        message: `Ingresso já utilizado em ${ticket.usedAt?.toLocaleString('pt-BR')}`,
        ticket,
      };
    }

    if (ticket.status === ETicketStatus.CANCELLED) {
      return {
        result: ECheckInResult.CANCELLED,
        message: 'Ingresso cancelado',
        ticket,
      };
    }

    return {
      result: ECheckInResult.SUCCESS,
      message: 'Ingresso válido',
      ticket,
    };
  }

  private async findTicket(code: string): Promise<TicketEntity> {
    const ticket = await this.ticketRepository.manager.findOne({
      where: { code },
      relations: ['event', 'ticketType', 'order'],
    });

    if (!ticket) {
      throw new HttpException('Ingresso inválido: código não encontrado', 404);
    }

    return ticket;
  }
}
