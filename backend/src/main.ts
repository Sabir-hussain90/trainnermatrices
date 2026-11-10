import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS (Allows local frontend on 3000, and your live Vercel frontend)
  app.enableCors({
    origin: [
      'http://localhost:3000', // Your local frontend
      'https://trainnermatrices-i8n8.vercel.app/' // Your live Vercel frontend
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // 2. Start the server
  const port = process.env.PORT || 4000; // <-- Changed default to 4000 for your local setup
  await app.listen(port);
  
  console.log(`🚀 Backend is running on: http://localhost:${port}`);
}
bootstrap();