"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const common_1 = require("@nestjs/common");
let app;
async function bootstrap() {
    const server = (0, express_1.default)();
    const adapter = new platform_express_1.ExpressAdapter(server);
    app = await core_1.NestFactory.create(app_module_1.AppModule, adapter);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    (0, swagger_1.setupSwagger)(app);
    await app.init();
    return server;
}
async function handler(req, res) {
    try {
        if (!app) {
            const server = await bootstrap();
            return server(req, res);
        }
        const server = app.getHttpAdapter().getInstance();
        return server(req, res);
    }
    catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
}
//# sourceMappingURL=main.js.map