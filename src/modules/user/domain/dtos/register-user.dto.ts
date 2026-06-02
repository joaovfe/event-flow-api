import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({ description: 'Nome do usuário', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio' })
  @Length(2, 50, {
    message: `O nome de usuário deve conter no mínimo 2 caracteres e no máximo 50`,
  })
  public name: string;

  @ApiProperty({
    description: 'Email do usuário (precisa ser único)',
    example: 'user@email.com',
  })
  @IsEmail({}, { message: 'O e-mail de usuário informado é inválido' })
  @MaxLength(256, {
    message: 'O Email do usuário pode conter no máximo 256 caracteres',
  })
  public email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'EventFlow@2024' })
  @IsNotEmpty()
  public password: string;
}
