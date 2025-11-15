"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOrderNumberToOrders1766000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddOrderNumberToOrders1766000000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'orderNumber',
            type: 'varchar',
            length: '50',
            isNullable: true,
        }));
        const orders = await queryRunner.query(`
      SELECT id FROM orders ORDER BY "createdAt" ASC
    `);
        const usedCodes = new Set();
        const generateRandomCode = (length) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        for (const order of orders) {
            let orderNumber = '';
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 20) {
                const randomCode = generateRandomCode(6);
                const candidateNumber = `MT-${randomCode}`;
                if (!usedCodes.has(candidateNumber)) {
                    isUnique = true;
                    orderNumber = candidateNumber;
                    usedCodes.add(orderNumber);
                }
                attempts++;
            }
            if (!isUnique || !orderNumber) {
                const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
                orderNumber = `MT-${timestamp}`;
                let counter = 0;
                while (usedCodes.has(orderNumber) && counter < 100) {
                    orderNumber = `MT-${timestamp}${counter}`;
                    counter++;
                }
                usedCodes.add(orderNumber);
            }
            await queryRunner.query(`
        UPDATE orders 
        SET "orderNumber" = $1 
        WHERE id = $2
      `, [orderNumber, order.id]);
        }
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_orders_orderNumber" 
      ON orders ("orderNumber")
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'orderNumber');
    }
}
exports.AddOrderNumberToOrders1766000000000 = AddOrderNumberToOrders1766000000000;
//# sourceMappingURL=1766000000000-AddOrderNumberToOrders.js.map