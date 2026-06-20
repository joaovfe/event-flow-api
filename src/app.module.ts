import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { EnvironmentVariablesModule } from '@core/enviroment-variables/enviroment-variables.module';
import { DatabaseModule } from '@core/database/database.module';
import { MetricsModule } from '@core/metrics/metrics.module';
import { MinioModule } from '@core/minio/minio.module';
import { AuditModule } from '@core/audit/audit.module';

import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { RoleModule } from '@modules/role/role.module';
import { EventModule } from '@modules/event/event.module';
import { TicketTypeModule } from '@modules/ticket-type/ticket-type.module';
import { OrderModule } from '@modules/order/order.module';
import { TicketModule } from '@modules/ticket/ticket.module';
import { CheckInModule } from '@modules/check-in/check-in.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/public',
    }),
    MulterModule.register({}),
    EventEmitterModule.forRoot(),
    EnvironmentVariablesModule,
    DatabaseModule,
    MetricsModule,
    MinioModule,
    AuditModule,
    AuthModule,
    UserModule,
    RoleModule,
    EventModule,
    TicketTypeModule,
    OrderModule,
    TicketModule,
    CheckInModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
