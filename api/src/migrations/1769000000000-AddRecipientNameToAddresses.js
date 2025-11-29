"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRecipientNameToAddresses1769000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddRecipientNameToAddresses1769000000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('addresses', new typeorm_1.TableColumn({
            name: 'recipientName',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('addresses', 'recipientName');
    }
}
exports.AddRecipientNameToAddresses1769000000000 = AddRecipientNameToAddresses1769000000000;
//# sourceMappingURL=1769000000000-AddRecipientNameToAddresses.js.map