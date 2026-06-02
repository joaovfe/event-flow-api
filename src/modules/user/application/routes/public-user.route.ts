import { Body } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { RegisterUserDTO } from '@modules/user/domain/dtos/register-user.dto';
import { UserController } from '@modules/user/application/decorators/user-controller.decorator';
import { UserService } from '@modules/user/domain/services/user.service';

@UserController.public()
export class PublicUserController {
  public constructor(private readonly service: UserService) {}

  @Endpoint.post({
    url: '/register',
    description: 'Registrar um novo usuário público',
    dtoName: 'RegisterUserDTO',
    withoutLogin: true,
    responses: [
      {
        description: 'Usuário registrado com sucesso',
        status: 201,
        response: UserEntity,
      },
    ],
  })
  public async register(@Body() dto: RegisterUserDTO) {
    return await this.service.register.execute({ dto });
  }
}
