"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddResiCodeToDeliveries1767000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddResiCodeToDeliveries1767000000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('delivery', new typeorm_1.TableColumn({
            name: 'resiCode',
            type: 'varchar',
            length: '50',
            isNullable: true,
            isUnique: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('delivery', 'resiCode');
    }
}
exports.AddResiCodeToDeliveries1767000000000 = AddResiCodeToDeliveries1767000000000;
//# sourceMappingURL=1767000000000-AddResiCodeToDeliveries.js.map