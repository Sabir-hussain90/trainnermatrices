import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { json, urlencoded } from 'express';

// Create the raw Express instance
const server = express();

export async function bootstrap() {
  // Pass the Express instance to NestJS
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Increase payload limit to 50MB to allow base64 images
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.init();
}

// Initialize the app
bootstrap();

// Only listen locally. Vercel sets process.env.VERCEL = "1" automatically.
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 4000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 API running on port ${port}`);
  });
}

// CRITICAL FOR VERCEL: Export the raw express server, not the NestJS promise
export default server;