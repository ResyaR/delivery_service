import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddOAuthFieldsToUser1762000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("user", [
            new TableColumn({
                name: "googleId",
                type: "varchar",
                isNullable: true,
                isUnique: true,
            }),
            new TableColumn({
                name: "facebookId",
                type: "varchar",
                isNullable: true,
                isUnique: true,
            }),
            new TableColumn({
                name: "provider",
                type: "varchar",
                default: "'local'",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("user", ["googleId", "facebookId", "provider"]);
    }
}

