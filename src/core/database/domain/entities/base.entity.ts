import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UUID } from 'crypto';

export abstract class BaseEntity {
  @ApiProperty({ description: 'Código de identificação do registro' })
  @PrimaryGeneratedColumn({ comment: 'Código de identificação do registro' })
  public id?: number;

  @ApiProperty({ description: 'Código UUID do registro' })
  @Column({
    name: 'uuid',
    type: 'varchar',
    length: 36,
    unique: true,
    default: () => 'gen_random_uuid()',
    comment: 'Código UUID do registro',
  })
  public uuid: UUID;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: 'Data de criação do registro',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt?: Date;

  @Exclude()
  @ApiProperty({ description: 'Data de edição do registro' })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    comment: 'Data de atualização do registro',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt?: Date;

  @Exclude()
  @ApiProperty({ description: 'Data de deleção do registro' })
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: 'Data de deleção do registro',
  })
  public deletedAt?: Date;
}
