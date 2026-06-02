import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTicketsTable1760000000004 implements MigrationInterface {
  name = 'CreateTicketsTable1760000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tickets_status_enum" AS ENUM('VALID', 'USED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tickets" (
        "id" SERIAL NOT NULL,
        "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "code" character varying(64) NOT NULL,
        "qr_code" text NOT NULL,
        "status" "public"."tickets_status_enum" NOT NULL DEFAULT 'VALID',
        "used_at" TIMESTAMP,
        "order_id" integer NOT NULL,
        "event_id" integer NOT NULL,
        "ticket_type_id" integer NOT NULL,
        CONSTRAINT "UQ_tickets_uuid" UNIQUE ("uuid"),
        CONSTRAINT "UQ_tickets_code" UNIQUE ("code"),
        CONSTRAINT "PK_tickets_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_ticket_type" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "tickets" IS 'Tabela para armazenar os ingressos gerados após a compra'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_ticket_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_event"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_order"`,
    );
    await queryRunner.query(`DROP TABLE "tickets"`);
    await queryRunner.query(`DROP TYPE "public"."tickets_status_enum"`);
  }
}
