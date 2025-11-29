import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRecipientNameToAddresses1769000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'addresses',
      new TableColumn({
        name: 'recipientName',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('addresses', 'recipientName');
  }
}

