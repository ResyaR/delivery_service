import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Delivery Service API')
    .setDescription('API documentation for MT trans')
    .setVersion('2.0')
    .addBearerAuth()
    .addServer('https://be-mt-trans.vercel.app')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'MT Trans API Docs',
    explorer: true,
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
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
