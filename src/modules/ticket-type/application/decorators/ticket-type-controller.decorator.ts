import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('ticket-types', 'Gerenciamento de tipos de ingresso');
  }

  public default() {
    return this.applyProperties(this.login());
  }
}

export const TicketTypeController = new Controller();
