"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAllTables1695000000006 = void 0;
class CreateAllTables1695000000006 {
    async up(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "delivery" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "driver" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "invalidated_token" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "otp_verification" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pending_user" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user" CASCADE`);
        await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        "isAdmin" boolean NOT NULL DEFAULT false,
        "fullName" character varying,
        "phone" character varying,
        "avatar" character varying,
        "refreshToken" character varying,
        "lastLogin" TIMESTAMP,
        "lastLogout" TIMESTAMP,
        "lastRequestRefreshToken" TIMESTAMP,
        "isVerified" boolean NOT NULL DEFAULT false,
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "UQ_user_username" UNIQUE ("username"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "pending_user" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        "otp" character varying,
        "otpExpiresAt" TIMESTAMP,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_pending_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_pending_user_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "otp_verification" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "otp" character varying NOT NULL,
        "isVerified" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "expiresAt" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_otp_verification_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "driver" (
        "id" SERIAL NOT NULL,
        "fullName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "vehicleNumber" character varying,
        "vehicleType" character varying,
        "status" character varying NOT NULL DEFAULT 'offline',
        "currentLatitude" DECIMAL(10,7),
        "currentLongitude" DECIMAL(10,7),
        "avatar" character varying,
        "refreshToken" character varying,
        "totalDeliveries" integer NOT NULL DEFAULT 0,
        "rating" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_driver_email" UNIQUE ("email"),
        CONSTRAINT "UQ_driver_phone" UNIQUE ("phone"),
        CONSTRAINT "PK_driver_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "delivery" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "pickupLocation" character varying NOT NULL,
        "dropoffLocation" character varying NOT NULL,
        "barang" json,
        "titipDeskripsi" character varying,
        "jadwal" TIMESTAMP,
        "price" DECIMAL(10,2) NOT NULL,
        "type" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "driverId" integer,
        "estimatedArrival" TIMESTAMP,
        "actualArrival" TIMESTAMP,
        "notes" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_delivery_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "invalidated_token" (
        "id" SERIAL NOT NULL,
        "token" character varying NOT NULL,
        "userId" integer NOT NULL,
        "invalidatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "expiresAt" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_invalidated_token_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "delivery" 
      ADD CONSTRAINT "FK_delivery_user" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "delivery" 
      ADD CONSTRAINT "FK_delivery_driver" 
      FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE SET NULL
    `);
        await queryRunner.query(`
      ALTER TABLE "invalidated_token" 
      ADD CONSTRAINT "FK_invalidated_token_user" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "invalidated_token"`);
        await queryRunner.query(`DROP TABLE "delivery"`);
        await queryRunner.query(`DROP TABLE "driver"`);
        await queryRunner.query(`DROP TABLE "otp_verification"`);
        await queryRunner.query(`DROP TABLE "pending_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.CreateAllTables1695000000006 = CreateAllTables1695000000006;
//# sourceMappingURL=1695000000006-CreateAllTables.js.map