import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventFlowAbilities1760000000005 implements MigrationInterface {
  name = 'AddEventFlowAbilities1760000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."abilities_reference_enum" ADD VALUE IF NOT EXISTS 'EVENTS'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."abilities_reference_enum" ADD VALUE IF NOT EXISTS 'TICKET_TYPES'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."abilities_reference_enum" ADD VALUE IF NOT EXISTS 'ORDERS'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."abilities_reference_enum" ADD VALUE IF NOT EXISTS 'CHECKIN'`,
    );
  }

  public async down(): Promise<void> {
    // PostgreSQL não permite remover valores de um ENUM existente.
    // O rollback é intencionalmente um no-op.
  }
}
