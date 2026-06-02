import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { TicketTypeEntity } from '../entities/ticket-type.entity';

@Injectable()
export class TicketTypeRepository extends BaseRepository<TicketTypeEntity> {
  public constructor(
    @InjectRepository(TicketTypeEntity)
    repository: Repository<TicketTypeEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
