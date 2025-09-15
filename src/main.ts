
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let app: any;

async function bootstrap() {
  const server = express();
  const adapter = new ExpressAdapter(server);
  
  app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  setupSwagger(app);
  await app.init();
  
  return server;
}

export default async function handler(req: any, res: any) {
  if (!app) {
    const server = await bootstrap();
    return server(req, res);
  }
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
