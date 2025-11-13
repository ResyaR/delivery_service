"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOAuthFieldsToUser1762000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddOAuthFieldsToUser1762000000000 {
    async up(queryRunner) {
        await queryRunner.addColumns("user", [
            new typeorm_1.TableColumn({
                name: "googleId",
                type: "varchar",
                isNullable: true,
                isUnique: true,
            }),
            new typeorm_1.TableColumn({
                name: "facebookId",
                type: "varchar",
                isNullable: true,
                isUnique: true,
            }),
            new typeorm_1.TableColumn({
                name: "provider",
                type: "varchar",
                default: "'local'",
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("user", ["googleId", "facebookId", "provider"]);
    }
}
exports.AddOAuthFieldsToUser1762000000000 = AddOAuthFieldsToUser1762000000000;
//# sourceMappingURL=1762000000000-AddOAuthFieldsToUser.js.map