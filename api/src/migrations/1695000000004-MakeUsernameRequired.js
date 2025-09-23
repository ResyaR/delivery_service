"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeUsernameRequired1695000000004 = void 0;
class MakeUsernameRequired1695000000004 {
    async up(queryRunner) {
        await queryRunner.query(`
      UPDATE "user" 
      SET username = SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) 
      WHERE username IS NULL
    `);
        await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN username SET NOT NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN username DROP NOT NULL
    `);
    }
}
exports.MakeUsernameRequired1695000000004 = MakeUsernameRequired1695000000004;
//# sourceMappingURL=1695000000004-MakeUsernameRequired.js.map