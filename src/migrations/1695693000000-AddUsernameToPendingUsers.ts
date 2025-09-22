import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToPendingUsers1695693000000 implements MigrationInterface {
    name = 'AddUsernameToPendingUsers1695693000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First add the column as nullable
        await queryRunner.query(`
            ALTER TABLE "pending_user" 
            ADD COLUMN IF NOT EXISTS "username" character varying
        `);

        // Update existing rows with a temporary username
        await queryRunner.query(`
            UPDATE "pending_user"
            SET "username" = 'user_' || id
            WHERE "username" IS NULL
        `);

        // Now make the column NOT NULL
        await queryRunner.query(`
            ALTER TABLE "pending_user"
            ALTER COLUMN "username" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pending_user" 
            DROP COLUMN IF EXISTS "username"
        `);
    }
}