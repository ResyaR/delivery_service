"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDeliveryFeatures1761760000000 = void 0;
class AddDeliveryFeatures1761760000000 {
    constructor() {
        this.name = 'AddDeliveryFeatures1761760000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "multi_drop_locations" (
                "id" SERIAL NOT NULL,
                "deliveryId" integer NOT NULL,
                "sequence" integer NOT NULL,
                "locationName" character varying NOT NULL,
                "address" character varying NOT NULL,
                "recipientName" character varying,
                "recipientPhone" character varying,
                "notes" character varying,
                "latitude" numeric(10,7),
                "longitude" numeric(10,7),
                "arrivedAt" TIMESTAMP,
                "isCompleted" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_multi_drop_locations" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "multi_drop_locations" 
            ADD CONSTRAINT "FK_multi_drop_locations_delivery" 
            FOREIGN KEY ("deliveryId") 
            REFERENCES "delivery"("id") 
            ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "delivery"
            ADD COLUMN IF NOT EXISTS "packageDetails" json,
            ADD COLUMN IF NOT EXISTS "scheduledDate" date,
            ADD COLUMN IF NOT EXISTS "scheduledTime" time,
            ADD COLUMN IF NOT EXISTS "scheduleTimeSlot" character varying,
            ADD COLUMN IF NOT EXISTS "totalDropPoints" integer,
            ADD COLUMN IF NOT EXISTS "totalDistance" numeric(10,2)
        `);
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_type_enum') THEN
                    CREATE TYPE "delivery_type_enum" AS ENUM('KIRIM_SEKARANG', 'JADWAL', 'TITIP_BELI');
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            ALTER TYPE "delivery_type_enum" ADD VALUE IF NOT EXISTS 'MULTI_DROP';
        `);
        await queryRunner.query(`
            ALTER TYPE "delivery_type_enum" ADD VALUE IF NOT EXISTS 'PAKET_BESAR';
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "multi_drop_locations" 
            DROP CONSTRAINT IF EXISTS "FK_multi_drop_locations_delivery"
        `);
        await queryRunner.query(`DROP TABLE IF EXISTS "multi_drop_locations"`);
        await queryRunner.query(`
            ALTER TABLE "delivery"
            DROP COLUMN IF EXISTS "packageDetails",
            DROP COLUMN IF EXISTS "scheduledDate",
            DROP COLUMN IF EXISTS "scheduledTime",
            DROP COLUMN IF EXISTS "scheduleTimeSlot",
            DROP COLUMN IF EXISTS "totalDropPoints",
            DROP COLUMN IF EXISTS "totalDistance"
        `);
    }
}
exports.AddDeliveryFeatures1761760000000 = AddDeliveryFeatures1761760000000;
//# sourceMappingURL=1761760000000-AddDeliveryFeatures.js.map