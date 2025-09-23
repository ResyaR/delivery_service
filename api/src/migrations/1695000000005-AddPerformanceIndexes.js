"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPerformanceIndexes1695000000005 = void 0;
const typeorm_1 = require("typeorm");
class AddPerformanceIndexes1695000000005 {
    async up(queryRunner) {
        await queryRunner.createIndex('delivery', new typeorm_1.TableIndex({
            name: 'IDX_DELIVERY_STATUS',
            columnNames: ['status']
        }));
        await queryRunner.createIndex('delivery', new typeorm_1.TableIndex({
            name: 'IDX_DELIVERY_DRIVER',
            columnNames: ['driverId']
        }));
        await queryRunner.createIndex('delivery', new typeorm_1.TableIndex({
            name: 'IDX_USER_DELIVERIES',
            columnNames: ['userId', 'status']
        }));
        await queryRunner.createIndex('delivery', new typeorm_1.TableIndex({
            name: 'IDX_DELIVERY_SCHEDULE',
            columnNames: ['jadwal']
        }));
        await queryRunner.createIndex('delivery', new typeorm_1.TableIndex({
            name: 'IDX_DELIVERY_CREATED',
            columnNames: ['createdAt']
        }));
        await queryRunner.query(`
      CREATE INDEX "IDX_PENDING_DELIVERIES" ON "delivery" ("status", "createdAt") 
      WHERE "status" = 'pending'
    `);
        await queryRunner.createIndex('user', new typeorm_1.TableIndex({
            name: 'IDX_USER_LAST_LOGIN',
            columnNames: ['lastLogin']
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_STATUS');
        await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_DRIVER');
        await queryRunner.dropIndex('delivery', 'IDX_USER_DELIVERIES');
        await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_SCHEDULE');
        await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_CREATED');
        await queryRunner.query('DROP INDEX IF EXISTS IDX_PENDING_DELIVERIES');
        await queryRunner.dropIndex('user', 'IDX_USER_LAST_LOGIN');
    }
}
exports.AddPerformanceIndexes1695000000005 = AddPerformanceIndexes1695000000005;
//# sourceMappingURL=1695000000005-AddPerformanceIndexes.js.map