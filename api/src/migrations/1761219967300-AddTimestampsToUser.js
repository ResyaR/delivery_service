"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTimestampsToUser1761219967300 = void 0;
class AddTimestampsToUser1761219967300 {
    constructor() {
        this.name = 'AddTimestampsToUser1761219967300';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_delivery_user"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_delivery_driver"`);
        await queryRunner.query(`ALTER TABLE "invalidated_token" DROP CONSTRAINT "FK_invalidated_token_user"`);
        await queryRunner.query(`ALTER TABLE "pending_user" DROP COLUMN "otpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "pending_user" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pending_user" DROP CONSTRAINT "UQ_pending_user_email"`);
        await queryRunner.query(`ALTER TABLE "driver" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."driver_status_enum" AS ENUM('available', 'busy', 'offline')`);
        await queryRunner.query(`ALTER TABLE "driver" ADD "status" "public"."driver_status_enum" NOT NULL DEFAULT 'offline'`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_type_enum" AS ENUM('KIRIM_SEKARANG', 'JADWAL', 'TITIP_BELI')`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "type" "public"."delivery_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_enum" AS ENUM('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "status" "public"."delivery_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_e1a5374a7f5c51edf274fc15483" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_e1a5374a7f5c51edf274fc15483"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_type_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "driver" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."driver_status_enum"`);
        await queryRunner.query(`ALTER TABLE "driver" ADD "status" character varying NOT NULL DEFAULT 'offline'`);
        await queryRunner.query(`ALTER TABLE "pending_user" ADD CONSTRAINT "UQ_pending_user_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pending_user" ADD "otp" character varying`);
        await queryRunner.query(`ALTER TABLE "pending_user" ADD "otpExpiresAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "invalidated_token" ADD CONSTRAINT "FK_invalidated_token_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_delivery_driver" FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_delivery_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.AddTimestampsToUser1761219967300 = AddTimestampsToUser1761219967300;
//# sourceMappingURL=1761219967300-AddTimestampsToUser.js.map