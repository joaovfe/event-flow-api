import { In } from 'typeorm';

import { EStatus } from '@shared/enums/status.enum';

import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { TicketTypeRepository } from '@modules/ticket-type/domain/repositories/ticket-type.repository';

import { ValidateCartDTO } from '@modules/order/domain/dtos/validate-cart.dto';

export interface ValidatedCartLine {
  ticketTypeId: number;
  name: string;
  eventTitle: string;
  price: number;
  quantity: number;
  available: number;
  subtotal: number;
  valid: boolean;
  reason?: string;
}

export interface ValidatedCart {
  items: Array<ValidatedCartLine>;
  total: number;
  valid: boolean;
}

export class ValidateCartProvider {
  public constructor(
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {}

  public async execute({ dto }: { dto: ValidateCartDTO }): Promise<ValidatedCart> {
    const ids = dto.items.map((item) => item.ticketTypeId);

    const ticketTypes = await this.ticketTypeRepository.manager.find({
      where: { id: In(ids) },
      relations: ['event'],
    });

    const items = dto.items.map((item) => {
      const ticketType = ticketTypes.find((t) => t.id === item.ticketTypeId);

      return this.buildLine(item.ticketTypeId, item.quantity, ticketType);
    });

    const total = items
      .filter((line) => line.valid)
      .reduce((sum, line) => sum + line.subtotal, 0);

    return {
      items,
      total,
      valid: items.every((line) => line.valid),
    };
  }

  private buildLine(
    ticketTypeId: number,
    quantity: number,
    ticketType?: TicketTypeEntity,
  ): ValidatedCartLine {
    if (!ticketType) {
      return this.invalidLine(ticketTypeId, quantity, 'Ingresso não encontrado');
    }

    const available = ticketType.quantity - ticketType.soldQuantity;
    const base: ValidatedCartLine = {
      ticketTypeId,
      name: ticketType.name,
      eventTitle: ticketType.event?.title ?? '',
      price: ticketType.price,
      quantity,
      available,
      subtotal: ticketType.price * quantity,
      valid: true,
    };

    if (!ticketType.active) {
      return { ...base, valid: false, reason: 'Ingresso indisponível' };
    }

    if (!ticketType.event || ticketType.event.status !== EStatus.ACTIVE) {
      return { ...base, valid: false, reason: 'Evento indisponível' };
    }

    if (quantity > available) {
      return {
        ...base,
        valid: false,
        reason: `Apenas ${available} ingresso(s) disponível(is)`,
      };
    }

    return base;
  }

  private invalidLine(
    ticketTypeId: number,
    quantity: number,
    reason: string,
  ): ValidatedCartLine {
    return {
      ticketTypeId,
      name: 'Desconhecido',
      eventTitle: '',
      price: 0,
      quantity,
      available: 0,
      subtotal: 0,
      valid: false,
      reason,
    };
  }
}
