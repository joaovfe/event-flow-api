import { Logger } from '@nestjs/common';
import * as Minio from 'minio';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

export class DeleteImageProvider {
  private readonly logger = new Logger(DeleteImageProvider.name);

  public constructor(
    private readonly minioClient: Minio.Client,
    private readonly env: EnvironmentVariablesProvider,
  ) {}

  public async execute(imageUrl: string): Promise<void> {
    try {
      const fileName = this.extractFileNameFromUrl(imageUrl);

      await this.minioClient.removeObject(
        this.env.minio.imagesBucket,
        fileName,
      );

      this.logger.log(`Imagem removida com sucesso: ${fileName}`);
    } catch (error) {
      this.logger.error('Erro ao remover imagem:', error);
      throw new Error('Falha ao remover imagem');
    }
  }

  private extractFileNameFromUrl(imageUrl: string): string {
    const urlParts = imageUrl.split('/');
    return urlParts.slice(-2).join('/');
  }
}
