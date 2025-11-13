import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class AddShippingManagerAndOrderFields1764000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create shipping_managers table
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Add new columns to orders table
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'deliveryCity',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'deliveryProvince',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'deliveryPostalCode',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'deliveryZone',
        type: 'int',
        isNullable: true,
      }),
    );

    // Add deliveryType column as varchar with check constraint
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'deliveryType',
        type: 'varchar',
        length: '50',
        default: "'regular'",
      }),
    );

    // Add check constraint for deliveryType
    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD CONSTRAINT "CHK_deliveryType" 
      CHECK ("deliveryType" IN ('regular', 'express', 'scheduled'))
    `);

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'scheduledDate',
        type: 'date',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'scheduledTime',
        type: 'time',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'scheduleTimeSlot',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'shippingManagerId',
        type: 'int',
        isNullable: true,
      }),
    );

    // Add foreign key for shippingManagerId
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['shippingManagerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shipping_managers',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key
    const table = await queryRunner.getTable('orders');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('shippingManagerId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('orders', foreignKey);
      }
    }

    // Remove check constraint first
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "CHK_deliveryType"`);

    // Remove columns from orders table
    await queryRunner.dropColumn('orders', 'shippingManagerId');
    await queryRunner.dropColumn('orders', 'scheduleTimeSlot');
    await queryRunner.dropColumn('orders', 'scheduledTime');
    await queryRunner.dropColumn('orders', 'scheduledDate');
    await queryRunner.dropColumn('orders', 'deliveryType');
    await queryRunner.dropColumn('orders', 'deliveryZone');
    await queryRunner.dropColumn('orders', 'deliveryPostalCode');
    await queryRunner.dropColumn('orders', 'deliveryProvince');
    await queryRunner.dropColumn('orders', 'deliveryCity');

    // Drop shipping_managers table
    await queryRunner.dropTable('shipping_managers');
  }
}

