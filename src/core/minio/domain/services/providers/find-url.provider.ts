import { Logger } from '@nestjs/common';
import * as Minio from 'minio';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

export class FindUrlProvider {
  private readonly logger = new Logger(FindUrlProvider.name);

  public constructor(
    private readonly minioClient: Minio.Client,
    private readonly env: EnvironmentVariablesProvider,
  ) {}

  public async execute(
    fileName: string,
    expiry: number = 3600,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.env.minio.imagesBucket,
        fileName,
        expiry,
      );
    } catch (error) {
      this.logger.error('Erro ao gerar URL pré-assinada:', error);
      throw new Error('Falha ao gerar URL pré-assinada');
    }
  }
}
