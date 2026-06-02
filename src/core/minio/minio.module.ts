import { Global, Module } from '@nestjs/common';
import { EnvironmentVariablesModule } from '@core/enviroment-variables/enviroment-variables.module';
import { MinioService } from './domain/services/minio.service';
import { MinioControllers } from './application/controllers/minio.controller';

@Global()
@Module({
  imports: [EnvironmentVariablesModule],
  controllers: [...MinioControllers],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule { }
