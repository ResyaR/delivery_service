"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddZoneToOngkirTables1700000000002 = void 0;
const typeorm_1 = require("typeorm");
class AddZoneToOngkirTables1700000000002 {
    async up(queryRunner) {
        await queryRunner.addColumn('ongkir_cities', new typeorm_1.TableColumn({
            name: 'zone',
            type: 'int',
            isNullable: true,
            comment: '1=Jawa&Bali, 2=Sumatera, 3=Kalimantan, 4=Sulawesi&NusaTenggara, 5=Maluku&Papua',
        }));
        await queryRunner.addColumn('ongkir_services', new typeorm_1.TableColumn({
            name: 'rate_per_km',
            type: 'int',
            isNullable: true,
            default: 1000,
            comment: 'Tarif per km dalam Rupiah (untuk jarak dalam zona yang sama)',
        }));
        await queryRunner.query(`
      CREATE TABLE ongkir_zone_tariffs (
        id SERIAL PRIMARY KEY,
        zone_from INT NOT NULL,
        zone_to INT NOT NULL,
        service_id INT NOT NULL,
        base_tariff INT NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES ongkir_services(id) ON DELETE CASCADE,
        UNIQUE(zone_from, zone_to, service_id)
      )
    `);
        await queryRunner.query(`
      COMMENT ON COLUMN ongkir_zone_tariffs.base_tariff IS 'Tarif dasar per kg antar zona'
    `);
        await queryRunner.query(`
      INSERT INTO ongkir_zone_tariffs (zone_from, zone_to, service_id, base_tariff) VALUES
      -- Zona 1 (Jawa & Bali) - Based on JNE actual pricing
      (1, 1, 1, 16000),  -- Jawa → Jawa, Reguler (JNE REG: ~16k/kg)
      (1, 1, 5, 12000),  -- Jawa → Jawa, Ekonomis
      (1, 1, 2, 36000),  -- Jawa → Jawa, Express (JNE YES: ~36k/kg)
      (1, 2, 1, 45000),  -- Jawa → Sumatera, Reguler
      (1, 2, 5, 30000),  -- Jawa → Sumatera, Ekonomis
      (1, 2, 2, 80000),  -- Jawa → Sumatera, Express
      (1, 3, 1, 60000),  -- Jawa → Kalimantan, Reguler
      (1, 3, 5, 42000),  -- Jawa → Kalimantan, Ekonomis
      (1, 3, 2, 110000), -- Jawa → Kalimantan, Express
      (1, 4, 1, 85000),  -- Jawa → Sulawesi, Reguler
      (1, 4, 5, 58000),  -- Jawa → Sulawesi, Ekonomis
      (1, 4, 2, 145000), -- Jawa → Sulawesi, Express
      (1, 5, 1, 185000), -- Jawa → Maluku & Papua, Reguler (JNE REG actual: ~185k/kg Ponorogo-Jayapura)
      (1, 5, 5, 70000),  -- Jawa → Maluku & Papua, Ekonomis (JNE JTR actual: ~70k/kg)
      (1, 5, 2, 280000), -- Jawa → Maluku & Papua, Express
      
      -- Zona 2 (Sumatera)
      (2, 1, 1, 45000),  -- Sumatera → Jawa, Reguler
      (2, 1, 5, 30000),  -- Ekonomis
      (2, 1, 2, 80000),  -- Express
      (2, 2, 1, 20000),  -- Sumatera → Sumatera
      (2, 2, 5, 15000),
      (2, 2, 2, 42000),
      (2, 3, 1, 55000),  -- Sumatera → Kalimantan
      (2, 3, 5, 38000),
      (2, 3, 2, 95000),
      (2, 4, 1, 78000),  -- Sumatera → Sulawesi
      (2, 4, 5, 52000),
      (2, 4, 2, 135000),
      (2, 5, 1, 175000), -- Sumatera → Maluku & Papua
      (2, 5, 5, 68000),
      (2, 5, 2, 265000),
      
      -- Zona 3 (Kalimantan)
      (3, 1, 1, 60000),  -- Kalimantan → Jawa
      (3, 1, 5, 42000),
      (3, 1, 2, 110000),
      (3, 2, 1, 55000),  -- Kalimantan → Sumatera
      (3, 2, 5, 38000),
      (3, 2, 2, 95000),
      (3, 3, 1, 25000),  -- Kalimantan → Kalimantan
      (3, 3, 5, 18000),
      (3, 3, 2, 52000),
      (3, 4, 1, 72000),  -- Kalimantan → Sulawesi
      (3, 4, 5, 48000),
      (3, 4, 2, 125000),
      (3, 5, 1, 168000), -- Kalimantan → Maluku & Papua
      (3, 5, 5, 65000),
      (3, 5, 2, 255000),
      
      -- Zona 4 (Sulawesi & Nusa Tenggara)
      (4, 1, 1, 85000),  -- Sulawesi → Jawa
      (4, 1, 5, 58000),
      (4, 1, 2, 145000),
      (4, 2, 1, 78000),  -- Sulawesi → Sumatera
      (4, 2, 5, 52000),
      (4, 2, 2, 135000),
      (4, 3, 1, 72000),  -- Sulawesi → Kalimantan
      (4, 3, 5, 48000),
      (4, 3, 2, 125000),
      (4, 4, 1, 28000),  -- Sulawesi → Sulawesi
      (4, 4, 5, 20000),
      (4, 4, 2, 58000),
      (4, 5, 1, 125000), -- Sulawesi → Maluku & Papua
      (4, 5, 5, 55000),
      (4, 5, 2, 195000),
      
      -- Zona 5 (Maluku & Papua)
      (5, 1, 1, 185000), -- Maluku & Papua → Jawa (matching JNE REG Ponorogo-Jayapura)
      (5, 1, 5, 70000),  -- (matching JNE JTR)
      (5, 1, 2, 280000),
      (5, 2, 1, 175000), -- Maluku & Papua → Sumatera
      (5, 2, 5, 68000),
      (5, 2, 2, 265000),
      (5, 3, 1, 168000), -- Maluku & Papua → Kalimantan
      (5, 3, 5, 65000),
      (5, 3, 2, 255000),
      (5, 4, 1, 125000), -- Maluku & Papua → Sulawesi
      (5, 4, 5, 55000),
      (5, 4, 2, 195000),
      (5, 5, 1, 45000),  -- Maluku & Papua → Maluku & Papua
      (5, 5, 5, 32000),
      (5, 5, 2, 95000)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS ongkir_zone_tariffs');
        await queryRunner.dropColumn('ongkir_services', 'rate_per_km');
        await queryRunner.dropColumn('ongkir_cities', 'zone');
    }
}
exports.AddZoneToOngkirTables1700000000002 = AddZoneToOngkirTables1700000000002;
//# sourceMappingURL=1700000000002-AddZoneToOngkirTables.js.map