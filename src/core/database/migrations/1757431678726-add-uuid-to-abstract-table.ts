import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUuidToAbstractTable1757431678726 implements MigrationInterface {
    name = 'AddUuidToAbstractTable1757431678726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "abilities" ADD "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "abilities" ADD CONSTRAINT "UQ_1a080b1f5b714dd0a95dff2566f" UNIQUE ("uuid")`);
        await queryRunner.query(`COMMENT ON COLUMN "abilities"."uuid" IS 'Código UUID do registro'`);
        await queryRunner.query(`ALTER TABLE "role_abilities" ADD "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "role_abilities" ADD CONSTRAINT "UQ_6dea067fc4e5e71e9ae95ed89a2" UNIQUE ("uuid")`);
        await queryRunner.query(`COMMENT ON COLUMN "role_abilities"."uuid" IS 'Código UUID do registro'`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_cdc7776894e484eaed828ca0616" UNIQUE ("uuid")`);
        await queryRunner.query(`COMMENT ON COLUMN "roles"."uuid" IS 'Código UUID do registro'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "uuid" character varying(36) NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1" UNIQUE ("uuid")`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."uuid" IS 'Código UUID do registro'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "users"."uuid" IS 'Código UUID do registro'`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "uuid"`);
        await queryRunner.query(`COMMENT ON COLUMN "roles"."uuid" IS 'Código UUID do registro'`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_cdc7776894e484eaed828ca0616"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "uuid"`);
        await queryRunner.query(`COMMENT ON COLUMN "role_abilities"."uuid" IS 'Código UUID do registro'`);
        await queryRunner.query(`ALTER TABLE "role_abilities" DROP CONSTRAINT "UQ_6dea067fc4e5e71e9ae95ed89a2"`);
        await queryRunner.query(`ALTER TABLE "role_abilities" DROP COLUMN "uuid"`);
        await queryRunner.query(`COMMENT ON COLUMN "abilities"."uuid" IS 'Código UUID do registro'`);
        await queryRunner.query(`ALTER TABLE "abilities" DROP CONSTRAINT "UQ_1a080b1f5b714dd0a95dff2566f"`);
        await queryRunner.query(`ALTER TABLE "abilities" DROP COLUMN "uuid"`);
    }

}
