
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';

let app: any;
let server: express.Express | null = null;
let isShuttingDown = false;
let isInitializing = false;

// Graceful shutdown handler for serverless
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
      // app.close() akan otomatis close database connection pool
      await app.close();
      console.log('Application and database connections closed');
    } catch (error) {
      console.error('Error closing app:', error);
    }
    
    app = null;
    server = null;
  }
}

async function bootstrap() {
  // Singleton pattern: hanya buat 1 instance app untuk semua request
  if (app && server) {
    return server;
  }

  if (isInitializing) {
    // Tunggu jika sedang initialize
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
    const expressServer = express();
    const adapter = new ExpressAdapter(expressServer);
    
    app = await NestFactory.create(AppModule, adapter, {
      logger: ['error', 'warn'],
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
    
    server = expressServer;
    isInitializing = false;
    
    console.log('✅ Application initialized (connection pool ready)');
    
    return server;
  } catch (error) {
    isInitializing = false;
    console.error('Bootstrap error:', error);
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end();
  }

  try {
    // Reuse existing app instance dan connection pool
    if (!app || !server) {
      server = await bootstrap();
    }
    
    return server(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    
    // Jika error connection-related, cleanup dan retry sekali
    if (error && error.message && (
      error.message.includes('connection') || 
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    )) {
      console.log('Connection error detected, cleaning up...');
      
      if (app && !isShuttingDown) {
        await closeApp();
      }
      
      // Retry sekali setelah cleanup
      try {
        server = await bootstrap();
        return server(req, res);
      } catch (retryError) {
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
