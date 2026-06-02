import { Logger } from '@nestjs/common';
import * as Minio from 'minio';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

export class FindImageProvider {
  private readonly logger = new Logger(FindImageProvider.name);

  public constructor(
    private readonly minioClient: Minio.Client,
    private readonly env: EnvironmentVariablesProvider,
  ) {}

  public async execute(entityId: string): Promise<string[]> {
    try {
      const objects = this.minioClient.listObjects(
        this.env.minio.imagesBucket,
        `${entityId}/`,
        true,
      );

      const imageUrls: string[] = [];
      for await (const obj of objects) {
        if (obj.name) {
          const imageUrl = `${this.env.minio.baseUrl}/${this.env.minio.imagesBucket}/${obj.name}`;
          imageUrls.push(imageUrl);
        }
      }

      return imageUrls;
    } catch (error) {
      this.logger.error('Erro ao listar imagens do veículo:', error);
      throw new Error('Falha ao listar imagens do veículo');
    }
  }
}
