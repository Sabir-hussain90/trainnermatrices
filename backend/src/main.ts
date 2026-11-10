import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

let app;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

  // Increase payload limit to 50MB to allow base64 images
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // 👇 Only listen locally. Vercel will use the exported app instance.
  if (process.env.NODE_ENV !== 'production') {
    const port = Number(process.env.PORT) || 4000;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
  }
  
  return app;
}

// 👇 CRITICAL FOR VERCEL
const server = bootstrap();
export default server;