import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryFeatures1761760000000 implements MigrationInterface {
    name = 'AddDeliveryFeatures1761760000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create multi_drop_locations table
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

        // Add foreign key
        await queryRunner.query(`
            ALTER TABLE "multi_drop_locations" 
            ADD CONSTRAINT "FK_multi_drop_locations_delivery" 
            FOREIGN KEY ("deliveryId") 
            REFERENCES "delivery"("id") 
            ON DELETE CASCADE
        `);

        // Add new fields to delivery table
        await queryRunner.query(`
            ALTER TABLE "delivery"
            ADD COLUMN IF NOT EXISTS "packageDetails" json,
            ADD COLUMN IF NOT EXISTS "scheduledDate" date,
            ADD COLUMN IF NOT EXISTS "scheduledTime" time,
            ADD COLUMN IF NOT EXISTS "scheduleTimeSlot" character varying,
            ADD COLUMN IF NOT EXISTS "totalDropPoints" integer,
            ADD COLUMN IF NOT EXISTS "totalDistance" numeric(10,2)
        `);

        // Update DeliveryType enum if not exists
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_type_enum') THEN
                    CREATE TYPE "delivery_type_enum" AS ENUM('KIRIM_SEKARANG', 'JADWAL', 'TITIP_BELI');
                END IF;
            END $$;
        `);

        // Add new enum values
        await queryRunner.query(`
            ALTER TYPE "delivery_type_enum" ADD VALUE IF NOT EXISTS 'MULTI_DROP';
        `);
        
        await queryRunner.query(`
            ALTER TYPE "delivery_type_enum" ADD VALUE IF NOT EXISTS 'PAKET_BESAR';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key first
        await queryRunner.query(`
            ALTER TABLE "multi_drop_locations" 
            DROP CONSTRAINT IF EXISTS "FK_multi_drop_locations_delivery"
        `);

        // Drop table
        await queryRunner.query(`DROP TABLE IF EXISTS "multi_drop_locations"`);
        
        // Remove columns from delivery table
        await queryRunner.query(`
            ALTER TABLE "delivery"
            DROP COLUMN IF EXISTS "packageDetails",
            DROP COLUMN IF EXISTS "scheduledDate",
            DROP COLUMN IF EXISTS "scheduledTime",
            DROP COLUMN IF EXISTS "scheduleTimeSlot",
            DROP COLUMN IF EXISTS "totalDropPoints",
            DROP COLUMN IF EXISTS "totalDistance"
        `);

        // Note: Cannot remove enum values in PostgreSQL, would need to recreate the enum type
    }
}

