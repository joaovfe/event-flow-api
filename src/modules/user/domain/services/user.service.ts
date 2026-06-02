import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './providers/create-user.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { DeleteUserProvider } from './providers/delete-user.provider';
import { FindOneUserProvider } from './providers/find-one-user.provider';
import { FindManyUserProvider } from './providers/find-many-user.provider';
import { RegisterUserProvider } from './providers/register-user.provider';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  public create: CreateUserProvider;
  public update: UpdateUserProvider;
  public delete: DeleteUserProvider;
  public findOne: FindOneUserProvider;
  public findMany: FindManyUserProvider;
  public register: RegisterUserProvider;

  public constructor(private readonly userRepository: UserRepository) {
    this.create = new CreateUserProvider(this.userRepository);
    this.update = new UpdateUserProvider(this.userRepository);
    this.delete = new DeleteUserProvider(this.userRepository);
    this.findOne = new FindOneUserProvider(this.userRepository);
    this.findMany = new FindManyUserProvider(this.userRepository);
    this.register = new RegisterUserProvider(this.userRepository);
  }
}
