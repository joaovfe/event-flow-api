import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('users', 'Gerenciamento de usuários');
  }

  public default() {
    return this.applyProperties(this.login());
  }

  public withoutLogin() {
    return this.applyProperties();
  }
}

export const UserController = new Controller();
