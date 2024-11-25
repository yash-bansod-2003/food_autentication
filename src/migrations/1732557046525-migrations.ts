import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1732557046525 implements MigrationInterface {
  name = "Migrations1732557046525";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD "address" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "restaurants" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "address"`);
  }
}
