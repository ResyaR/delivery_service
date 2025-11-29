"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAddressTable1768000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateAddressTable1768000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'addresses',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'label',
                    type: 'varchar',
                },
                {
                    name: 'street',
                    type: 'varchar',
                },
                {
                    name: 'city',
                    type: 'varchar',
                },
                {
                    name: 'cityId',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'province',
                    type: 'varchar',
                },
                {
                    name: 'postalCode',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'zone',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'note',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'isDefault',
                    type: 'boolean',
                    default: false,
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
        await queryRunner.createForeignKey('addresses', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('addresses');
        const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('addresses', foreignKey);
        }
        await queryRunner.dropTable('addresses');
    }
}
exports.CreateAddressTable1768000000000 = CreateAddressTable1768000000000;
//# sourceMappingURL=1768000000000-CreateAddressTable.js.map