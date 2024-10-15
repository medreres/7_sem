import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFilesUrlToProduct1728644798952 implements MigrationInterface {
  name = 'AddFilesUrlToProduct1728644798952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'product',
      'specificationDoc',
      'dataSheetUrl',
    );
    await queryRunner.query(
      'ALTER TABLE "product" ADD "quickStartUrl" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "product" ADD "instructionsUrl" character varying',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product" DROP COLUMN "instructionsUrl"',
    );
    await queryRunner.query(
      'ALTER TABLE "product" DROP COLUMN "quickStartUrl"',
    );
    await queryRunner.renameColumn(
      'product',
      'dataSheetUrl',
      'specificationDoc',
    );
  }
}
