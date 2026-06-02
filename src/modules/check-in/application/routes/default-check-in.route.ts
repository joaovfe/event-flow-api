import { Body, Param } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { CheckInDTO } from '@modules/check-in/domain/dtos/check-in.dto';
import { CheckInPayload } from '@modules/check-in/domain/payloads/check-in.payload';
import { CheckInController } from '@modules/check-in/application/decorators/check-in-controller.decorator';
import { CheckInService } from '@modules/check-in/domain/services/check-in.service';

@CheckInController.default()
export class DefaultCheckInController {
  public constructor(private readonly service: CheckInService) {}

  @Endpoint.get({
    url: '/:code',
    description: 'Inspecionar um ingresso pelo código sem marcá-lo como usado',
    abilities: ['CHECKIN'],
    actions: ['READ'],
    responses: [
      { description: 'Resultado da inspeção', status: 200, response: CheckInPayload },
      { description: 'Ingresso inválido', status: 404 },
    ],
  })
  public async inspect(@Param('code') code: string) {
    return await this.service.inspect.execute({ code });
  }

  @Endpoint.post({
    url: '/',
    description: 'Validar a entrada de um ingresso e marcá-lo como utilizado',
    dtoName: 'CheckInDTO',
    abilities: ['CHECKIN'],
    actions: ['UPDATE'],
    responses: [
      { description: 'Resultado do check-in', status: 200, response: CheckInPayload },
      { description: 'Ingresso inválido', status: 404 },
    ],
  })
  public async checkIn(@Body() dto: CheckInDTO) {
    return await this.service.checkIn.execute({ code: dto.code });
  }
}
