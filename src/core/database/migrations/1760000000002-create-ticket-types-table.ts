import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTicketTypesTable1760000000002 implements MigrationInterface {
  name = 'CreateTicketTypesTable1760000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ticket_types" (
        "id" SERIAL NOT NULL,
        "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying(100) NOT NULL,
        "description" character varying(255),
        "price" numeric(10,2) NOT NULL,
        "quantity" integer NOT NULL,
        "sold_quantity" integer NOT NULL DEFAULT 0,
        "active" boolean NOT NULL DEFAULT true,
        "event_id" integer NOT NULL,
        CONSTRAINT "UQ_ticket_types_uuid" UNIQUE ("uuid"),
        CONSTRAINT "PK_ticket_types_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_types" ADD CONSTRAINT "FK_ticket_types_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "ticket_types" IS 'Tabela para armazenar os tipos de ingresso de cada evento'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket_types" DROP CONSTRAINT "FK_ticket_types_event"`,
    );
    await queryRunner.query(`DROP TABLE "ticket_types"`);
  }
}
