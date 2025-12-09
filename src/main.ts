
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

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
      allowedHeaders: ['Content-Type', 'Authorization', 'admin-key', 'shipping-manager-token'], // Include admin-key and shipping-manager-token headers
      credentials: true,
    });
    
    // Use global exception filter to ensure CORS headers are always set
    app.useGlobalFilters(new AllExceptionsFilter());
    
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, admin-key, shipping-manager-token'); // Include admin-key and shipping-manager-token
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
    const isConnectionError = error && error.message && (
      error.message.includes('connection') || 
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Connection terminated') ||
      error.message.includes('Unable to connect') ||
      error.message.includes('Connection terminated due to connection timeout') ||
      error.message.includes('Connection terminated unexpectedly')
    );
    
    if (isConnectionError) {
      console.log('Connection error detected, cleaning up and retrying...');
      
      if (app && !isShuttingDown) {
        try {
          await closeApp();
          // Wait a bit longer for cleanup
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (closeError) {
          console.error('Error during cleanup:', closeError);
        }
      }
      
      // Retry sekali setelah cleanup dengan delay
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Longer delay before retry
        server = await bootstrap();
        return server(req, res);
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        // If retry fails, return error response
        if (!res.headersSent) {
          res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
          res.status(503).json({ 
            statusCode: 503,
            message: 'Database connection error. Please try again.',
            timestamp: new Date().toISOString()
          });
        }
        return;
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