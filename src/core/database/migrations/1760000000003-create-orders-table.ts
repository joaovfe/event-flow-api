import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1760000000003 implements MigrationInterface {
  name = 'CreateOrdersTable1760000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "customer_name" character varying(150) NOT NULL,
        "customer_email" character varying(256) NOT NULL,
        "customer_document" character varying(14),
        "total" numeric(10,2) NOT NULL,
        "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING',
        "user_id" integer,
        CONSTRAINT "UQ_orders_uuid" UNIQUE ("uuid"),
        CONSTRAINT "PK_orders_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_orders_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "orders" IS 'Tabela para armazenar os pedidos de compra de ingressos'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_user"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
  }
}
