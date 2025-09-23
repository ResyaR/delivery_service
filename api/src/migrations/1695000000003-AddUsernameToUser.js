"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUsernameToUser1695000000003 = void 0;
const typeorm_1 = require("typeorm");
class AddUsernameToUser1695000000003 {
    async up(queryRunner) {
        await queryRunner.addColumn('user', new typeorm_1.TableColumn({
            name: 'username',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('user', 'username');
    }
}
exports.AddUsernameToUser1695000000003 = AddUsernameToUser1695000000003;
//# sourceMappingURL=1695000000003-AddUsernameToUser.js.map