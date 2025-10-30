"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddResetTokenToUser1761900000000 = void 0;
const typeorm_1 = require("typeorm");
class AddResetTokenToUser1761900000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('user', new typeorm_1.TableColumn({
            name: 'resetToken',
            type: 'varchar',
            isNullable: true,
        }));
        await queryRunner.addColumn('user', new typeorm_1.TableColumn({
            name: 'resetTokenExpiry',
            type: 'timestamp',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('user', 'resetTokenExpiry');
        await queryRunner.dropColumn('user', 'resetToken');
    }
}
exports.AddResetTokenToUser1761900000000 = AddResetTokenToUser1761900000000;
//# sourceMappingURL=1761900000000-AddResetTokenToUser.js.map