import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ILike, QueryRunner } from 'typeorm';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { RegisterUserDTO } from '@modules/user/domain/dtos/register-user.dto';
import { PasswordHelper } from '@modules/user/domain/helpers/password.helper';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { ERoleReference } from '@modules/role/domain/enums/role-reference.enum';

export class RegisterUserProvider {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute({
    dto,
    queryRunner,
  }: {
    dto: RegisterUserDTO;
    queryRunner?: QueryRunner;
  }): Promise<UserEntity> {
    await this.validateUserEmail(dto.email);

    if (queryRunner) {
      return await this.saveUserWithTransaction(dto, queryRunner);
    }

    return await this.userRepository.transaction(async (query) => {
      return await this.saveUserWithTransaction(dto, query);
    });
  }

  private async validateUserEmail(email: string): Promise<void> {
    const user = await this.userRepository.manager.findOne({
      where: { email: ILike(email) },
    });

    if (user) {
      throw new HttpException(
        'Já existe um usuário cadastrado com o e-mail informado',
        412,
      );
    }
  }

  private async saveUserWithTransaction(
    dto: RegisterUserDTO,
    query: QueryRunner,
  ) {
    const role = await this.findRoleWithTransaction(ERoleReference.USER, query);

    const user = await query.manager.save(
      UserEntity,
      await this.serialize(dto, role),
    );

    return user;
  }

  private async findRoleWithTransaction(
    reference: ERoleReference,
    query: QueryRunner,
  ) {
    const role = await query.manager.findOne(RoleEntity, {
      where: { reference },
    });

    if (role) return role;

    throw new HttpException('Perfil do usuário não encontrado', 404);
  }

  private async serialize(dto: RegisterUserDTO, role: RoleEntity) {
    const password = PasswordHelper.hashSync(dto.password);

    const user = plainToInstance(
      UserEntity,
      {
        ...dto,
        role,
        password,
      },
      { ignoreDecorators: true },
    );

    return user;
  }
}
