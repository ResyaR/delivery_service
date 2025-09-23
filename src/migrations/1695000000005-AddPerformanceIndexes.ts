import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddPerformanceIndexes1695000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add index for delivery status
    await queryRunner.createIndex('delivery', new TableIndex({
      name: 'IDX_DELIVERY_STATUS',
      columnNames: ['status']
    }));

    // Add index for driver assignments
    await queryRunner.createIndex('delivery', new TableIndex({
      name: 'IDX_DELIVERY_DRIVER',
      columnNames: ['driverId']
    }));

    // Add composite index for user's deliveries
    await queryRunner.createIndex('delivery', new TableIndex({
      name: 'IDX_USER_DELIVERIES',
      columnNames: ['userId', 'status']
    }));

    // Add index for scheduled deliveries
    await queryRunner.createIndex('delivery', new TableIndex({
      name: 'IDX_DELIVERY_SCHEDULE',
      columnNames: ['jadwal']
    }));

    // Add index for creation date
    await queryRunner.createIndex('delivery', new TableIndex({
      name: 'IDX_DELIVERY_CREATED',
      columnNames: ['createdAt']
    }));

    // Add partial index for pending deliveries (most frequently queried)
    await queryRunner.query(`
      CREATE INDEX "IDX_PENDING_DELIVERIES" ON "delivery" ("status", "createdAt") 
      WHERE "status" = 'pending'
    `);

    // Add index for user's last activity
    await queryRunner.createIndex('user', new TableIndex({
      name: 'IDX_USER_LAST_LOGIN',
      columnNames: ['lastLogin']
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_STATUS');
    await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_DRIVER');
    await queryRunner.dropIndex('delivery', 'IDX_USER_DELIVERIES');
    await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_SCHEDULE');
    await queryRunner.dropIndex('delivery', 'IDX_DELIVERY_CREATED');
    await queryRunner.query('DROP INDEX IF EXISTS IDX_PENDING_DELIVERIES');
    await queryRunner.dropIndex('user', 'IDX_USER_LAST_LOGIN');
  }
}