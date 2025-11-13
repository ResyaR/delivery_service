"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddShippingManagerAndOrderFields1764000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddShippingManagerAndOrderFields1764000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'shipping_managers',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'zone',
                    type: 'int',
                },
                {
                    name: 'token',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'isActive',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'deliveryCity',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'deliveryProvince',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'deliveryPostalCode',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'deliveryZone',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'deliveryType',
            type: 'varchar',
            length: '50',
            default: "'regular'",
        }));
        await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "CHK_deliveryType" 
      CHECK ("deliveryType" IN ('regular', 'express', 'scheduled'))
    `);
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'scheduledDate',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'scheduledTime',
            type: 'time',
            isNullable: true,
        }));
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'scheduleTimeSlot',
            type: 'varchar',
            length: '50',
            isNullable: true,
        }));
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'shippingManagerId',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.createForeignKey('orders', new typeorm_1.TableForeignKey({
            columnNames: ['shippingManagerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'shipping_managers',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('orders');
        if (table) {
            const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('shippingManagerId') !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey('orders', foreignKey);
            }
        }
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "CHK_deliveryType"`);
        await queryRunner.dropColumn('orders', 'shippingManagerId');
        await queryRunner.dropColumn('orders', 'scheduleTimeSlot');
        await queryRunner.dropColumn('orders', 'scheduledTime');
        await queryRunner.dropColumn('orders', 'scheduledDate');
        await queryRunner.dropColumn('orders', 'deliveryType');
        await queryRunner.dropColumn('orders', 'deliveryZone');
        await queryRunner.dropColumn('orders', 'deliveryPostalCode');
        await queryRunner.dropColumn('orders', 'deliveryProvince');
        await queryRunner.dropColumn('orders', 'deliveryCity');
        await queryRunner.dropTable('shipping_managers');
    }
}
exports.AddShippingManagerAndOrderFields1764000000000 = AddShippingManagerAndOrderFields1764000000000;
//# sourceMappingURL=1764000000000-AddShippingManagerAndOrderFields.js.map