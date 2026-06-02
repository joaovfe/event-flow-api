import { Logger } from '@nestjs/common';
import * as Minio from 'minio';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

export class InitializeBucketProvider {
  private readonly logger = new Logger(InitializeBucketProvider.name);

  public constructor(
    private readonly minioClient: Minio.Client,
    private readonly env: EnvironmentVariablesProvider,
  ) {}

  public async execute(): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(
        this.env.minio.imagesBucket,
      );

      if (!bucketExists) {
        await this.minioClient.makeBucket(
          this.env.minio.imagesBucket,
          'us-east-1',
        );
        this.logger.log(
          `Bucket ${this.env.minio.imagesBucket} criado com sucesso`,
        );
      }
    } catch (error) {
      this.logger.error('Erro ao inicializar bucket:', error);
      throw error;
    }
  }
}
