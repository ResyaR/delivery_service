"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsAdminColumnToUser1758593912284 = void 0;
class AddIsAdminColumnToUser1758593912284 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE;
            
            -- Set admin for existing user with email ending in @admin.com
            UPDATE "user"
            SET "isAdmin" = TRUE
            WHERE email LIKE '%@admin.com';
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN "isAdmin";
        `);
    }
}
exports.AddIsAdminColumnToUser1758593912284 = AddIsAdminColumnToUser1758593912284;
//# sourceMappingURL=1758593912284-AddIsAdminColumnToUser.js.map