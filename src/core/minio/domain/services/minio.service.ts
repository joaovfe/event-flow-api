import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

import { DeleteImageProvider } from './providers/delete-image.provider';
import { FindImageProvider } from './providers/find-image.provider';
import { FindUrlProvider } from './providers/find-url.provider';
import { InitializeBucketProvider } from './providers/initialize-bucket.provider';
import { UploadImageProvider } from './providers/upload-image.provider';

@Injectable()
export class MinioService {
  public initializeBucket: InitializeBucketProvider;
  public uploadImage: UploadImageProvider;
  public deleteImage: DeleteImageProvider;
  public findUrl: FindUrlProvider;
  public findImage: FindImageProvider;

  private readonly minioClient: Minio.Client;

  constructor(private readonly env: EnvironmentVariablesProvider) {
    this.minioClient = new Minio.Client({
      endPoint: this.env.minio.endpoint,
      port: this.env.minio.port,
      useSSL: this.env.minio.useSSL,
      accessKey: this.env.minio.accessKey,
      secretKey: this.env.minio.secretKey,
    });

    this.initializeBucket = new InitializeBucketProvider(
      this.minioClient,
      this.env,
    );

    this.uploadImage = new UploadImageProvider(
      this.minioClient,
      this.env,
    );

    this.deleteImage = new DeleteImageProvider(
      this.minioClient,
      this.env,
    );

    this.findUrl = new FindUrlProvider(
      this.minioClient,
      this.env,
    );

    this.findImage = new FindImageProvider(
      this.minioClient,
      this.env,
    );

    this.initializeBucket.execute();
  }

}
