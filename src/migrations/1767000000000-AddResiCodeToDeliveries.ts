import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddResiCodeToDeliveries1767000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'delivery',
      new TableColumn({
        name: 'resiCode',
        type: 'varchar',
        length: '50',
        isNullable: true,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('delivery', 'resiCode');
  }
}

