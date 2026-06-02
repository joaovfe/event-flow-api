import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ILike, Not } from 'typeorm';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { UpdateEventDTO } from '@modules/event/domain/dtos/update-event.dto';
import { EventRepository } from '@modules/event/domain/repositories/event.repository';
import { SlugHelper } from '@modules/event/domain/helpers/slug.helper';

export class UpdateEventProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute(params: {
    id: number;
    data: UpdateEventDTO;
  }): Promise<EventEntity> {
    const event = await this.findEvent(params.id);

    const slug = params.data.slug
      ? await this.resolveSlug(params.data.slug, event.id)
      : event.slug;

    const updated = plainToInstance(
      EventEntity,
      { ...event, ...params.data, slug },
      { ignoreDecorators: true },
    );

    return await this.eventRepository.manager.save(updated);
  }

  private async findEvent(id: number): Promise<EventEntity> {
    const event = await this.eventRepository.manager.findOne({
      where: { id },
    });

    if (event) return event;

    throw new HttpException('Evento não encontrado', 404);
  }

  private async resolveSlug(value: string, id: number): Promise<string> {
    const slug = SlugHelper.generate(value);

    const existing = await this.eventRepository.manager.findOne({
      where: { slug: ILike(slug), id: Not(id) },
    });

    if (existing) {
      throw new HttpException(
        'Já existe um evento cadastrado com este slug',
        412,
      );
    }

    return slug;
  }
}
