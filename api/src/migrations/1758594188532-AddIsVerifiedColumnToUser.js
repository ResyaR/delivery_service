"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsVerifiedColumnToUser1758594188532 = void 0;
class AddIsVerifiedColumnToUser1758594188532 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT FALSE;
            
            -- Set existing users as verified for backward compatibility
            UPDATE "user"
            SET "isVerified" = TRUE;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN "isVerified";
        `);
    }
}
exports.AddIsVerifiedColumnToUser1758594188532 = AddIsVerifiedColumnToUser1758594188532;
//# sourceMappingURL=1758594188532-AddIsVerifiedColumnToUser.js.map