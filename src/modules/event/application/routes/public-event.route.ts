import { Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { FindManyEventDTO } from '@modules/event/domain/dtos/find-many-event.dto';
import { EventController } from '@modules/event/application/decorators/event-controller.decorator';
import { EventService } from '@modules/event/domain/services/event.service';

@EventController.public()
export class PublicEventController {
  public constructor(private readonly service: EventService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar eventos ativos disponíveis publicamente',
    dtoName: 'FindManyEventDTO',
    withoutLogin: true,
    responses: [
      {
        description: 'Listagem pública dos eventos',
        status: 200,
        findManyModel: EventEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyEventDTO) {
    return await this.service.findPublicMany.execute({ dto });
  }

  @Endpoint.get({
    url: '/:slug',
    description: 'Buscar os detalhes públicos de um evento pelo slug',
    withoutLogin: true,
    responses: [
      {
        description: 'Dados públicos do evento',
        status: 200,
        response: EventEntity,
      },
      { description: 'Evento não encontrado', status: 404 },
    ],
  })
  public async findOne(@Param('slug') slug: string) {
    return await this.service.findPublicOne.execute({ slug });
  }
}
