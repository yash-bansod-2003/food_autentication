import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1732556500119 implements MigrationInterface {
  name = "Migrations1732556500119";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstname" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastname" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastname"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstname"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstName" character varying NOT NULL`,
    );
  }
}
