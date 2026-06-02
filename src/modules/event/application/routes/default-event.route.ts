import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { CreateEventDTO } from '@modules/event/domain/dtos/create-event.dto';
import { UpdateEventDTO } from '@modules/event/domain/dtos/update-event.dto';
import { FindManyEventDTO } from '@modules/event/domain/dtos/find-many-event.dto';
import { EventController } from '@modules/event/application/decorators/event-controller.decorator';
import { EventService } from '@modules/event/domain/services/event.service';

@EventController.default()
export class DefaultEventController {
  public constructor(private readonly service: EventService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar eventos (administração)',
    dtoName: 'FindManyEventDTO',
    abilities: ['EVENTS'],
    actions: ['READ'],
    responses: [
      {
        description: 'Listagem dos eventos',
        status: 200,
        findManyModel: EventEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyEventDTO) {
    return await this.service.findMany.execute({ dto });
  }

  @Endpoint.get({
    url: '/:id',
    description: 'Buscar um evento pelo seu ID',
    abilities: ['EVENTS'],
    actions: ['READ'],
    responses: [
      {
        description: 'Dados do evento',
        status: 200,
        response: EventEntity,
      },
      { description: 'Evento não encontrado', status: 404 },
    ],
  })
  public async findOne(@Param('id') id: number) {
    return await this.service.findOne.execute({ id });
  }

  @Endpoint.post({
    url: '/',
    description: 'Criar um novo evento',
    dtoName: 'CreateEventDTO',
    abilities: ['EVENTS'],
    actions: ['CREATE'],
    responses: [
      {
        description: 'Evento criado com sucesso',
        status: 200,
        response: EventEntity,
      },
      { description: 'Erro de validação', status: 412 },
    ],
  })
  public async create(@Body() dto: CreateEventDTO) {
    return await this.service.create.execute({ dto });
  }

  @Endpoint.put({
    url: '/:id',
    description: 'Editar um evento existente',
    dtoName: 'UpdateEventDTO',
    abilities: ['EVENTS'],
    actions: ['UPDATE'],
    responses: [
      {
        description: 'Evento editado com sucesso',
        status: 200,
        response: EventEntity,
      },
      { description: 'Evento não encontrado', status: 404 },
    ],
  })
  public async update(@Param('id') id: number, @Body() data: UpdateEventDTO) {
    return await this.service.update.execute({ id, data });
  }

  @Endpoint.patch({
    url: '/:id/toggle-status',
    description: 'Ativar/desativar um evento',
    abilities: ['EVENTS'],
    actions: ['UPDATE'],
    responses: [
      {
        description: 'Status do evento alterado com sucesso',
        status: 200,
        response: EventEntity,
      },
      { description: 'Evento não encontrado', status: 404 },
    ],
  })
  public async toggleStatus(@Param('id') id: number) {
    return await this.service.toggleStatus.execute({ id });
  }

  @Endpoint.delete({
    url: '/:id',
    description: 'Apagar um evento',
    abilities: ['EVENTS'],
    actions: ['DELETE'],
    responses: [
      { description: 'Evento deletado com sucesso', status: 200 },
      { description: 'Evento não encontrado', status: 404 },
    ],
  })
  public async delete(@Param('id') id: number) {
    return await this.service.delete.execute({ id });
  }
}
