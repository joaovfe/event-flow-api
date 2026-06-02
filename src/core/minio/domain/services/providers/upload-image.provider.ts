import { BadRequestException, Logger } from '@nestjs/common';
import * as Minio from 'minio';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { EImageType } from '../../enums/EImageType';

export class UploadImageProvider {
  private readonly logger = new Logger(UploadImageProvider.name);

  public constructor(
    private readonly minioClient: Minio.Client,
    private readonly env: EnvironmentVariablesProvider,
  ) {}

  public async execute(
    file: Express.Multer.File,
    entityId: string,
    imageType: EImageType,
  ): Promise<string> {
    this.validateFile(file);

    try {
      const fileName = `${entityId}/${imageType}/${Date.now()}-${file.originalname}`;

      await this.minioClient.putObject(
        this.env.minio.imagesBucket,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      const imageUrl = `${this.env.minio.baseUrl}/${this.env.minio.imagesBucket}/${fileName}`;

      this.logger.log(`Imagem enviada com sucesso: ${fileName}`);
      return imageUrl;
    } catch (error) {
      this.logger.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Falha ao fazer upload da imagem');
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de arquivo não suportado. Use JPG, PNG ou WEBP',
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Arquivo muito grande. Tamanho máximo permitido: 10MB',
      );
    }
  }
}
