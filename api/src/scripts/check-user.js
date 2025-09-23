"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../users/user.entity");
(0, dotenv_1.config)();
async function checkUser() {
    const connection = await (0, typeorm_1.createConnection)({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [user_entity_1.User],
    });
    try {
        const userRepository = connection.getRepository(user_entity_1.User);
        const user = await userRepository.findOne({
            where: { email: 'olgared@soscandia.org' }
        });
        console.log('User data:', user);
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await connection.close();
    }
}
checkUser();
//# sourceMappingURL=check-user.js.map