"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRestaurantMenuOrderTables1700000000003 = void 0;
class CreateRestaurantMenuOrderTables1700000000003 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        description TEXT,
        image VARCHAR,
        category VARCHAR NOT NULL,
        rating DECIMAL(3,2) DEFAULT 0,
        "totalOrders" INT DEFAULT 0,
        status VARCHAR DEFAULT 'active',
        address VARCHAR,
        phone VARCHAR,
        "openingTime" TIME,
        "closingTime" TIME,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await queryRunner.query(`
      CREATE TABLE menus (
        id SERIAL PRIMARY KEY,
        "restaurantId" INT NOT NULL,
        name VARCHAR NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR,
        category VARCHAR NOT NULL,
        availability BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("restaurantId") REFERENCES restaurants(id) ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        "userId" INT NOT NULL,
        "restaurantId" INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        "deliveryFee" DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        "deliveryAddress" TEXT NOT NULL,
        status VARCHAR DEFAULT 'pending',
        notes TEXT,
        "customerName" VARCHAR,
        "customerPhone" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE,
        FOREIGN KEY ("restaurantId") REFERENCES restaurants(id) ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        "orderId" INT NOT NULL,
        "menuId" INT NOT NULL,
        "menuName" VARCHAR NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY ("menuId") REFERENCES menus(id)
      )
    `);
        await queryRunner.query(`CREATE INDEX idx_menus_restaurant ON menus("restaurantId")`);
        await queryRunner.query(`CREATE INDEX idx_orders_user ON orders("userId")`);
        await queryRunner.query(`CREATE INDEX idx_orders_restaurant ON orders("restaurantId")`);
        await queryRunner.query(`CREATE INDEX idx_orders_status ON orders(status)`);
        await queryRunner.query(`CREATE INDEX idx_order_items_order ON order_items("orderId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS order_items CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS orders CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS menus CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS restaurants CASCADE`);
    }
}
exports.CreateRestaurantMenuOrderTables1700000000003 = CreateRestaurantMenuOrderTables1700000000003;
//# sourceMappingURL=1700000000003-CreateRestaurantMenuOrderTables.js.map