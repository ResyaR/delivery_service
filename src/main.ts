
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';

let app: any;
let isShuttingDown = false;

// Graceful shutdown handler for serverless
process.on('SIGTERM', async () => {
  if (!isShuttingDown && app) {
    isShuttingDown = true;
    console.log('SIGTERM received, closing application...');
    await app.close();
  }
});

async function bootstrap() {
  const server = express();
  const adapter = new ExpressAdapter(server);
  
  app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn'], // Only show errors and warnings
  });
  
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
    
    // Cleanup app jika error
    if (app && !isShuttingDown) {
      try {
        await app.close();
        app = null;
      } catch (closeError) {
        console.error('Error closing app:', closeError);
      }
    }
    
    res.status(500).json({ 
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
