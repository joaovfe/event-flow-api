import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('audit-logs', 'Trilha de auditoria das ações administrativas');
  }

  public default() {
    return this.applyProperties(this.login());
  }
}

export const AuditLogController = new Controller();
