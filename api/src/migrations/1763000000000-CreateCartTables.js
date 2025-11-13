"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCartTables1763000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateCartTables1763000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'carts',
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
                    isNullable: false,
                },
                {
                    name: 'restaurantId',
                    type: 'int',
                    isNullable: true,
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
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'cart_items',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'cartId',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'menuId',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'quantity',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: false,
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
        await queryRunner.createForeignKey('carts', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('cart_items', new typeorm_1.TableForeignKey({
            columnNames: ['cartId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'carts',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('cart_items', new typeorm_1.TableForeignKey({
            columnNames: ['menuId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'menus',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('carts', new typeorm_1.TableIndex({
            name: 'IDX_CART_USER_ID',
            columnNames: ['userId'],
        }));
        await queryRunner.createIndex('cart_items', new typeorm_1.TableIndex({
            name: 'IDX_CART_ITEM_CART_ID',
            columnNames: ['cartId'],
        }));
        await queryRunner.createIndex('cart_items', new typeorm_1.TableIndex({
            name: 'IDX_CART_ITEM_MENU_ID',
            columnNames: ['menuId'],
        }));
    }
    async down(queryRunner) {
        const cartTable = await queryRunner.getTable('carts');
        const cartItemTable = await queryRunner.getTable('cart_items');
        if (cartItemTable) {
            const foreignKeys = cartItemTable.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('cart_items', fk);
            }
        }
        if (cartTable) {
            const foreignKeys = cartTable.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('carts', fk);
            }
        }
        await queryRunner.dropIndex('cart_items', 'IDX_CART_ITEM_MENU_ID');
        await queryRunner.dropIndex('cart_items', 'IDX_CART_ITEM_CART_ID');
        await queryRunner.dropIndex('carts', 'IDX_CART_USER_ID');
        await queryRunner.dropTable('cart_items');
        await queryRunner.dropTable('carts');
    }
}
exports.CreateCartTables1763000000000 = CreateCartTables1763000000000;
//# sourceMappingURL=1763000000000-CreateCartTables.js.map