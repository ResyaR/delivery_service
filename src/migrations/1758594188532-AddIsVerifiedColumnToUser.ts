import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsVerifiedColumnToUser1758594188532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT FALSE;
            
            -- Set existing users as verified for backward compatibility
            UPDATE "user"
            SET "isVerified" = TRUE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN "isVerified";
        `);
    }

}
