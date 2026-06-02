import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { TicketTypeEntity } from '@modules/ticket-type/domain/entities/ticket-type.entity';
import { CreateTicketTypeDTO } from '@modules/ticket-type/domain/dtos/create-ticket-type.dto';
import { UpdateTicketTypeDTO } from '@modules/ticket-type/domain/dtos/update-ticket-type.dto';
import { FindManyTicketTypeDTO } from '@modules/ticket-type/domain/dtos/find-many-ticket-type.dto';
import { TicketTypeController } from '@modules/ticket-type/application/decorators/ticket-type-controller.decorator';
import { TicketTypeService } from '@modules/ticket-type/domain/services/ticket-type.service';

@TicketTypeController.default()
export class DefaultTicketTypeController {
  public constructor(private readonly service: TicketTypeService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar tipos de ingresso',
    dtoName: 'FindManyTicketTypeDTO',
    abilities: ['TICKET_TYPES'],
    actions: ['READ'],
    responses: [
      {
        description: 'Listagem dos tipos de ingresso',
        status: 200,
        findManyModel: TicketTypeEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyTicketTypeDTO) {
    return await this.service.findMany.execute({ dto });
  }

  @Endpoint.get({
    url: '/:id',
    description: 'Buscar um tipo de ingresso pelo ID',
    abilities: ['TICKET_TYPES'],
    actions: ['READ'],
    responses: [
      { description: 'Dados do tipo de ingresso', status: 200, response: TicketTypeEntity },
      { description: 'Tipo de ingresso não encontrado', status: 404 },
    ],
  })
  public async findOne(@Param('id') id: number) {
    return await this.service.findOne.execute({ id });
  }

  @Endpoint.post({
    url: '/',
    description: 'Criar um novo tipo de ingresso',
    dtoName: 'CreateTicketTypeDTO',
    abilities: ['TICKET_TYPES'],
    actions: ['CREATE'],
    responses: [
      { description: 'Tipo de ingresso criado com sucesso', status: 200, response: TicketTypeEntity },
      { description: 'Evento não encontrado', status: 404 },
    ],
  })
  public async create(@Body() dto: CreateTicketTypeDTO) {
    return await this.service.create.execute({ dto });
  }

  @Endpoint.put({
    url: '/:id',
    description: 'Editar um tipo de ingresso',
    dtoName: 'UpdateTicketTypeDTO',
    abilities: ['TICKET_TYPES'],
    actions: ['UPDATE'],
    responses: [
      { description: 'Tipo de ingresso editado com sucesso', status: 200, response: TicketTypeEntity },
      { description: 'Tipo de ingresso não encontrado', status: 404 },
    ],
  })
  public async update(@Param('id') id: number, @Body() data: UpdateTicketTypeDTO) {
    return await this.service.update.execute({ id, data });
  }

  @Endpoint.patch({
    url: '/:id/toggle-active',
    description: 'Ativar/desativar um tipo de ingresso',
    abilities: ['TICKET_TYPES'],
    actions: ['UPDATE'],
    responses: [
      { description: 'Status alterado com sucesso', status: 200, response: TicketTypeEntity },
      { description: 'Tipo de ingresso não encontrado', status: 404 },
    ],
  })
  public async toggleActive(@Param('id') id: number) {
    return await this.service.toggleActive.execute({ id });
  }

  @Endpoint.delete({
    url: '/:id',
    description: 'Apagar um tipo de ingresso',
    abilities: ['TICKET_TYPES'],
    actions: ['DELETE'],
    responses: [
      { description: 'Tipo de ingresso deletado com sucesso', status: 200 },
      { description: 'Tipo de ingresso não encontrado', status: 404 },
    ],
  })
  public async delete(@Param('id') id: number) {
    return await this.service.delete.execute({ id });
  }
}
