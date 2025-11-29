"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDeliveryAddressLabelToOrders1770000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddDeliveryAddressLabelToOrders1770000000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'deliveryAddressLabel',
            type: 'varchar',
            length: '50',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'deliveryAddressLabel');
    }
}
exports.AddDeliveryAddressLabelToOrders1770000000000 = AddDeliveryAddressLabelToOrders1770000000000;
//# sourceMappingURL=1770000000000-AddDeliveryAddressLabelToOrders.js.map