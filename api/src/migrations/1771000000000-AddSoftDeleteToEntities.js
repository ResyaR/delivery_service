"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSoftDeleteToEntities1771000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddSoftDeleteToEntities1771000000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('user', new typeorm_1.TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
        }));
        await queryRunner.addColumn('restaurants', new typeorm_1.TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
        }));
        await queryRunner.addColumn('menus', new typeorm_1.TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
        }));
        await queryRunner.addColumn('shipping_managers', new typeorm_1.TableColumn({
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('shipping_managers', 'deletedAt');
        await queryRunner.dropColumn('menus', 'deletedAt');
        await queryRunner.dropColumn('restaurants', 'deletedAt');
        await queryRunner.dropColumn('user', 'deletedAt');
    }
}
exports.AddSoftDeleteToEntities1771000000000 = AddSoftDeleteToEntities1771000000000;
//# sourceMappingURL=1771000000000-AddSoftDeleteToEntities.js.map