import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { EventEntity } from '../entities/event.entity';

@Injectable()
export class EventRepository extends BaseRepository<EventEntity> {
  public constructor(
    @InjectRepository(EventEntity)
    repository: Repository<EventEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
