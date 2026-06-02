import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ILike } from 'typeorm';

import { EStatus } from '@shared/enums/status.enum';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { CreateEventDTO } from '@modules/event/domain/dtos/create-event.dto';
import { EventRepository } from '@modules/event/domain/repositories/event.repository';
import { SlugHelper } from '@modules/event/domain/helpers/slug.helper';

export class CreateEventProvider {
  public constructor(private readonly eventRepository: EventRepository) {}

  public async execute({ dto }: { dto: CreateEventDTO }): Promise<EventEntity> {
    const slug = await this.resolveSlug(dto.slug ?? dto.title);

    const event = plainToInstance(
      EventEntity,
      {
        ...dto,
        slug,
        status: dto.status ?? EStatus.ACTIVE,
      },
      { ignoreDecorators: true },
    );

    return await this.eventRepository.manager.save(event);
  }

  private async resolveSlug(value: string): Promise<string> {
    const slug = SlugHelper.generate(value);

    const existing = await this.eventRepository.manager.findOne({
      where: { slug: ILike(slug) },
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
