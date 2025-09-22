"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUsernameToPendingUsers1695693000000 = void 0;
class AddUsernameToPendingUsers1695693000000 {
    constructor() {
        this.name = 'AddUsernameToPendingUsers1695693000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "pending_user" 
            ADD COLUMN IF NOT EXISTS "username" character varying
        `);
        await queryRunner.query(`
            UPDATE "pending_user"
            SET "username" = 'user_' || id
            WHERE "username" IS NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pending_user"
            ALTER COLUMN "username" SET NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "pending_user" 
            DROP COLUMN IF EXISTS "username"
        `);
    }
}
exports.AddUsernameToPendingUsers1695693000000 = AddUsernameToPendingUsers1695693000000;
//# sourceMappingURL=1695693000000-AddUsernameToPendingUsers.js.map