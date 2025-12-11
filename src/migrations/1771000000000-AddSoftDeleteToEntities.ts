import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSoftDeleteToEntities1771000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add deletedAt to user table
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Add deletedAt to restaurants table
    await queryRunner.addColumn(
      'restaurants',
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Add deletedAt to menus table
    await queryRunner.addColumn(
      'menus',
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Add deletedAt to shipping_managers table
    await queryRunner.addColumn(
      'shipping_managers',
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove deletedAt from shipping_managers table
    await queryRunner.dropColumn('shipping_managers', 'deletedAt');

    // Remove deletedAt from menus table
    await queryRunner.dropColumn('menus', 'deletedAt');

    // Remove deletedAt from restaurants table
    await queryRunner.dropColumn('restaurants', 'deletedAt');

    // Remove deletedAt from user table
    await queryRunner.dropColumn('user', 'deletedAt');
  }
}

