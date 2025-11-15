"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization', 'admin-key', 'shipping-manager-token'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    (0, swagger_1.setupSwagger)(app);
    await app.listen(4000);
    console.log(`Application is running on: http://localhost:4000`);
    console.log(`Swagger documentation is available at: http://localhost:4000/api/docs`);
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, closing application gracefully...');
        await app.close();
        process.exit(0);
    });
    process.on('SIGINT', async () => {
        console.log('SIGINT received, closing application gracefully...');
        await app.close();
        process.exit(0);
    });
}
bootstrap();
//# sourceMappingURL=main-dev.js.map