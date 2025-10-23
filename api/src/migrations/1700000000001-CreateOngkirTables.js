"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOngkirTables1700000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateOngkirTables1700000000001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'ongkir_cities',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                },
                {
                    name: 'province',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'varchar',
                    length: '20',
                    isNullable: false,
                },
                {
                    name: 'postal_code',
                    type: 'varchar',
                    length: '10',
                    isNullable: true,
                },
                {
                    name: 'multiplier',
                    type: 'decimal',
                    precision: 3,
                    scale: 2,
                    default: 1.0,
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '20',
                    default: "'active'",
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndex('ongkir_cities', new typeorm_1.TableIndex({
            name: 'IDX_ONGKIR_CITIES_PROVINCE',
            columnNames: ['province'],
        }));
        await queryRunner.createIndex('ongkir_cities', new typeorm_1.TableIndex({
            name: 'IDX_ONGKIR_CITIES_STATUS',
            columnNames: ['status'],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'ongkir_services',
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
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'estimasi',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'base_rate',
                    type: 'int',
                    isNullable: false,
                    comment: 'Tarif dasar per kg dalam Rupiah',
                },
                {
                    name: 'multiplier',
                    type: 'decimal',
                    precision: 3,
                    scale: 2,
                    default: 1.0,
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '20',
                    default: "'active'",
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'ongkir_pricing',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'city_from_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'city_to_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'service_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'rate_per_kg',
                    type: 'int',
                    isNullable: false,
                    comment: 'Tarif per kg dalam Rupiah',
                },
                {
                    name: 'min_weight',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    default: 0.5,
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '20',
                    default: "'active'",
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndex('ongkir_pricing', new typeorm_1.TableIndex({
            name: 'IDX_ONGKIR_PRICING_CITIES',
            columnNames: ['city_from_id', 'city_to_id'],
        }));
        await queryRunner.createIndex('ongkir_pricing', new typeorm_1.TableIndex({
            name: 'IDX_ONGKIR_PRICING_SERVICE',
            columnNames: ['service_id'],
        }));
        await queryRunner.query(`
      ALTER TABLE ongkir_pricing
      ADD CONSTRAINT FK_ONGKIR_PRICING_CITY_FROM
      FOREIGN KEY (city_from_id) REFERENCES ongkir_cities(id)
      ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE ongkir_pricing
      ADD CONSTRAINT FK_ONGKIR_PRICING_CITY_TO
      FOREIGN KEY (city_to_id) REFERENCES ongkir_cities(id)
      ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE ongkir_pricing
      ADD CONSTRAINT FK_ONGKIR_PRICING_SERVICE
      FOREIGN KEY (service_id) REFERENCES ongkir_services(id)
      ON DELETE CASCADE
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE ongkir_pricing DROP CONSTRAINT IF EXISTS FK_ONGKIR_PRICING_SERVICE
    `);
        await queryRunner.query(`
      ALTER TABLE ongkir_pricing DROP CONSTRAINT IF EXISTS FK_ONGKIR_PRICING_CITY_TO
    `);
        await queryRunner.query(`
      ALTER TABLE ongkir_pricing DROP CONSTRAINT IF EXISTS FK_ONGKIR_PRICING_CITY_FROM
    `);
        await queryRunner.dropTable('ongkir_pricing', true);
        await queryRunner.dropTable('ongkir_services', true);
        await queryRunner.dropTable('ongkir_cities', true);
    }
}
exports.CreateOngkirTables1700000000001 = CreateOngkirTables1700000000001;
//# sourceMappingURL=1700000000001-CreateOngkirTables.js.map