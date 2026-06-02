import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('events', 'Gerenciamento de eventos');
  }

  public default() {
    return this.applyProperties(this.login());
  }

  public public() {
    return this.applyPropertiesWithSuffix('public');
  }
}

export const EventController = new Controller();
