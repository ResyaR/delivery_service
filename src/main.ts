
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';

let app: any;

async function bootstrap() {
  const server = express();
  const adapter = new ExpressAdapter(server);
  
  app = await NestFactory.create(AppModule, adapter);
  
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
  
  await app.init();
  return server;
}

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      const server = await bootstrap();
      return server(req, res);
    }
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
