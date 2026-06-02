import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('minio', 'Gerenciamento de arquivos MinIO');
  }

  public default() {
    return this.applyProperties(this.login());
  }
}

export const MinioController = new Controller();
