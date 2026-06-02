import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('check-in', 'Validação de ingressos (check-in)');
  }

  public default() {
    return this.applyProperties(this.login());
  }
}

export const CheckInController = new Controller();
