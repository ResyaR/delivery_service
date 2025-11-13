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
let server = null;
let isShuttingDown = false;
let isInitializing = false;
process.on('SIGTERM', async () => {
    if (!isShuttingDown && app) {
        isShuttingDown = true;
        console.log('SIGTERM received, closing application...');
        await closeApp();
    }
});
async function closeApp() {
    if (app) {
        try {
            await app.close();
            console.log('Application and database connections closed');
        }
        catch (error) {
            console.error('Error closing app:', error);
        }
        app = null;
        server = null;
    }
}
async function bootstrap() {
    if (app && server) {
        return server;
    }
    if (isInitializing) {
        let waitCount = 0;
        while (isInitializing && waitCount < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            waitCount++;
        }
        if (app && server) {
            return server;
        }
    }
    isInitializing = true;
    try {
        const expressServer = (0, express_1.default)();
        const adapter = new platform_express_1.ExpressAdapter(expressServer);
        app = await core_1.NestFactory.create(app_module_1.AppModule, adapter, {
            logger: ['error', 'warn'],
        });
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: ['Content-Type', 'Authorization', 'admin-key'],
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }));
        (0, swagger_1.setupSwagger)(app);
        await app.init();
        server = expressServer;
        isInitializing = false;
        console.log('✅ Application initialized (connection pool ready)');
        return server;
    }
    catch (error) {
        isInitializing = false;
        console.error('Bootstrap error:', error);
        throw error;
    }
}
async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, admin-key');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(204).end();
    }
    try {
        if (!app || !server) {
            server = await bootstrap();
        }
        return server(req, res);
    }
    catch (error) {
        console.error('Handler error:', error);
        if (error && error.message && (error.message.includes('connection') ||
            error.message.includes('timeout') ||
            error.message.includes('ECONNREFUSED'))) {
            console.log('Connection error detected, cleaning up...');
            if (app && !isShuttingDown) {
                await closeApp();
            }
            try {
                server = await bootstrap();
                return server(req, res);
            }
            catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }
        if (!res.headersSent) {
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }
}
//# sourceMappingURL=main.js.map