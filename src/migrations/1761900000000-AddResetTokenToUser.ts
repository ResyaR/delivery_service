import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddResetTokenToUser1761900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add resetToken column
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'resetToken',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Add resetTokenExpiry column
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'resetTokenExpiry',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'resetTokenExpiry');
    await queryRunner.dropColumn('user', 'resetToken');
  }
}

