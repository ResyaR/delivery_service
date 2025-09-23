import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddIsAdminColumnToUser1758593912284 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
