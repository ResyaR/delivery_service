import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddSoftDeleteToEntities1771000000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
