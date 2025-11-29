import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeliveryAddressLabelToOrders1770000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'deliveryAddressLabel',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'deliveryAddressLabel');
  }
}

