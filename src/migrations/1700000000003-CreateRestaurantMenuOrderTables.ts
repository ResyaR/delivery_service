import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRestaurantMenuOrderTables1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create restaurants table
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

    // Create menus table
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

    // Create orders table
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

    // Create order_items table
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

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX idx_menus_restaurant ON menus("restaurantId")`);
    await queryRunner.query(`CREATE INDEX idx_orders_user ON orders("userId")`);
    await queryRunner.query(`CREATE INDEX idx_orders_restaurant ON orders("restaurantId")`);
    await queryRunner.query(`CREATE INDEX idx_orders_status ON orders(status)`);
    await queryRunner.query(`CREATE INDEX idx_order_items_order ON order_items("orderId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS order_items CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS menus CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS restaurants CASCADE`);
  }
}

