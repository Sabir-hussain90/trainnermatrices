import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { json, urlencoded } from 'express';

const server = express();

export const createServer = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  // Keep your 50MB limit
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  await app.init();
  return server;
};

let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await createServer();
  }
  cachedServer(req, res);
}