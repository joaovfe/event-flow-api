import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends BaseRepository<OrderEntity> {
  public constructor(
    @InjectRepository(OrderEntity)
    repository: Repository<OrderEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
