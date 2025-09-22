import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAdminToUsers1695000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE;
      
      -- Set admin for existing user with email ending in @admin.com
      UPDATE "user"
      SET "isAdmin" = TRUE
      WHERE email LIKE '%@admin.com';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN "isAdmin";
    `);
  }
}