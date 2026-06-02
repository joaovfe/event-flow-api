import { Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { UploadImageResponseDto } from '@core/minio/domain/dtos/upload-image-response.dto';
import { UploadImageDto } from '@core/minio/domain/dtos/upload-image.dto';
import { MinioController } from '@core/minio/application/decorators/minio-controller.decorator';
import { MinioService } from '@core/minio/domain/services/minio.service';

@MinioController.default()
export class DefaultMinioController {
  public constructor(private readonly service: MinioService) {}

  @Endpoint.post({
    url: '/image',
    description: 'Faz upload de imagem',
    responses: [
      {
        status: 201,
        description: 'Imagem enviada com sucesso',
        response: UploadImageResponseDto,
      },
    ],
    withoutLogin: false,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem e dados da entidade ou evento',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPG, PNG, WEBP)',
        },
        entityId: {
          type: 'string',
          description: 'ID da entidade',
          example: 'uuid-da-entidade',
        },
        imageType: {
          type: 'string',
          enum: ['main', 'gallery'],
          description: 'Tipo da imagem',
          example: 'gallery',
        },
      },
      required: ['file', 'entityId', 'imageType'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadData: UploadImageDto,
  ): Promise<UploadImageResponseDto> {
    const imageUrl = await this.service.uploadImage.execute(
      file,
      uploadData.entityId,
      uploadData.imageType,
    );

    return {
      imageUrl,
      fileName: `${uploadData.entityId}/${uploadData.imageType}/${Date.now()}-${file.originalname}`,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }
}
