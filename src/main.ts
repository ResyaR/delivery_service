
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const expressApp = express();
let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.enableCors();
    setupSwagger(app);
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req, res) {
  const server = await bootstrapServer();
  server(req, res);
}
