"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Delivery Service API')
        .setDescription('API documentation for MT trans')
        .setVersion('2.0')
        .addBearerAuth()
        .addServer('https://be-mt-trans.vercel.app')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'MT Trans API Docs',
        explorer: true,
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-standalone-preset.js'
        ],
        customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui.css'
        ],
        swaggerOptions: {
            persistAuthorization: true,
            layout: "BaseLayout",
            deepLinking: true,
            showExtensions: true,
            showCommonExtensions: true,
            defaultModelsExpandDepth: 3,
            defaultModelExpandDepth: 3,
            displayOperationId: true,
            displayRequestDuration: true,
            filter: true,
            tryItOutEnabled: true
        }
    });
}
//# sourceMappingURL=swagger.js.map