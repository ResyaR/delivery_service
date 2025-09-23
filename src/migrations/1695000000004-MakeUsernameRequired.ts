import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUsernameRequired1695000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, update existing users with null username to use email as username
    await queryRunner.query(`
      UPDATE "user" 
      SET username = SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) 
      WHERE username IS NULL
    `);

    // Then make the column not nullable
    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN username SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN username DROP NOT NULL
    `);
  }
}