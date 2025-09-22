"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsAdminToUsers1695000000002 = void 0;
class AddIsAdminToUsers1695000000002 {
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
exports.AddIsAdminToUsers1695000000002 = AddIsAdminToUsers1695000000002;
//# sourceMappingURL=1695000000002-AddIsAdminToUsers.js.map