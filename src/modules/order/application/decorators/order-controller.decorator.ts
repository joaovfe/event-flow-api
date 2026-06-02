import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('orders', 'Gerenciamento de pedidos');
  }

  public default() {
    return this.applyProperties(this.login());
  }

  public public() {
    return this.applyPropertiesWithSuffix('public');
  }
}

export const OrderController = new Controller();
