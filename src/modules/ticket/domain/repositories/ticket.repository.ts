import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { TicketEntity } from '../entities/ticket.entity';

@Injectable()
export class TicketRepository extends BaseRepository<TicketEntity> {
  public constructor(
    @InjectRepository(TicketEntity)
    repository: Repository<TicketEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
