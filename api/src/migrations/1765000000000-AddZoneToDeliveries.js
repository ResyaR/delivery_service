"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddZoneToDeliveries1765000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddZoneToDeliveries1765000000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('delivery', new typeorm_1.TableColumn({
            name: 'deliveryZone',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.addColumn('delivery', new typeorm_1.TableColumn({
            name: 'shippingManagerId',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.createForeignKey('delivery', new typeorm_1.TableForeignKey({
            columnNames: ['shippingManagerId'],
            referencedTableName: 'shipping_managers',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('delivery');
        if (table) {
            const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('shippingManagerId') !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey('delivery', foreignKey);
            }
        }
        await queryRunner.dropColumn('delivery', 'shippingManagerId');
        await queryRunner.dropColumn('delivery', 'deliveryZone');
    }
}
exports.AddZoneToDeliveries1765000000000 = AddZoneToDeliveries1765000000000;
//# sourceMappingURL=1765000000000-AddZoneToDeliveries.js.map