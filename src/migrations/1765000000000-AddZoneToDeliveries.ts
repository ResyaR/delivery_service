import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddZoneToDeliveries1765000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add deliveryZone column
    await queryRunner.addColumn(
      'delivery',
      new TableColumn({
        name: 'deliveryZone',
        type: 'int',
        isNullable: true,
      }),
    );

    // Add shippingManagerId column
    await queryRunner.addColumn(
      'delivery',
      new TableColumn({
        name: 'shippingManagerId',
        type: 'int',
        isNullable: true,
      }),
    );

    // Add foreign key constraint for shippingManagerId
    await queryRunner.createForeignKey(
      'delivery',
      new TableForeignKey({
        columnNames: ['shippingManagerId'],
        referencedTableName: 'shipping_managers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('delivery');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('shippingManagerId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('delivery', foreignKey);
      }
    }

    await queryRunner.dropColumn('delivery', 'shippingManagerId');
    await queryRunner.dropColumn('delivery', 'deliveryZone');
  }
}

