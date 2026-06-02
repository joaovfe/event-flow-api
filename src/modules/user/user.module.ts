import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserControllers } from './application/controllers/user.controller';
import { UserRepository } from './domain/repositories/user.repository';
import { UserEntity } from './domain/entities/user.entity';
import { UserService } from './domain/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository, UserService],
  controllers: [...UserControllers],
  exports: [UserRepository],
})
export class UserModule {}
