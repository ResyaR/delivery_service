import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Delivery Service API')
    .setDescription('API documentation for login, register, refresh, profile, and logout')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .opblock.opblock-get {
        border-color: #1e90ff;
        background: #e6f2ff;
      }
      .swagger-ui .opblock.opblock-post {
        border-color: #28a745;
        background: #eafaf1;
      }
      .swagger-ui .opblock.opblock-put {
        border-color: #ffc107;
        background: #fffbe6;
      }
      .swagger-ui .opblock.opblock-delete {
        border-color: #dc3545;
        background: #fdeaea;
      }
    `,
  };
  SwaggerModule.setup('docs', app, document, customOptions);
}
