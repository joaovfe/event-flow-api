import { ApiProperty } from "@nestjs/swagger";

export class UploadImageResponseDto {
    @ApiProperty({
        description: 'URL da imagem enviada',
        example:
            'http://localhost:9000/images/uuid-da-entidade/gallery/1234567890-image.jpg',
    })
    public imageUrl: string;

    @ApiProperty({
        description: 'Nome do arquivo',
        example: 'uuid-da-entidade/gallery/1234567890-image.jpg',
    })
    public fileName: string;

    @ApiProperty({
        description: 'Tamanho do arquivo em bytes',
        example: 1024000,
    })
    public fileSize: number;

    @ApiProperty({
        description: 'Tipo MIME do arquivo',
        example: 'image/jpeg',
    })
    public mimeType: string;
}