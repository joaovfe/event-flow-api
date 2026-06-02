import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsTable1760000000001 implements MigrationInterface {
  name = 'CreateEventsTable1760000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."events_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" (
        "id" SERIAL NOT NULL,
        "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "title" character varying(150) NOT NULL,
        "slug" character varying(180) NOT NULL,
        "description" text NOT NULL,
        "image" character varying(500),
        "location" character varying(255) NOT NULL,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "status" "public"."events_status_enum" NOT NULL DEFAULT 'ACTIVE',
        CONSTRAINT "UQ_events_uuid" UNIQUE ("uuid"),
        CONSTRAINT "UQ_events_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_events_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "events" IS 'Tabela para armazenar os eventos da plataforma'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
  }
}
