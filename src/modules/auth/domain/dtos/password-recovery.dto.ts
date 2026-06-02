import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordRecoveryDTO {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  public email: string;
}
