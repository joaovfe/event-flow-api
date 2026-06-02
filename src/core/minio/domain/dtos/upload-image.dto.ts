import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { EImageType } from '../enums/EImageType';

export class UploadImageDto {
  @ApiProperty({
    description: 'Tipo da imagem',
    enum: EImageType,
    example: EImageType.GALLERY,
  })
  @IsEnum(EImageType)
  public imageType: EImageType;

  @ApiProperty({
    description: 'ID da entidade',
    example: 'uuid-do-veiculo',
  })
  @IsString()
  public entityId: string;
}

