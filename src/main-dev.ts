import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Setup Swagger
  setupSwagger(app);
  
  await app.listen(4000);
  console.log(`Application is running on: http://localhost:4000`);
  console.log(`Swagger documentation is available at: http://localhost:4000/api/docs`);
  
  // Graceful shutdown handlers
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
