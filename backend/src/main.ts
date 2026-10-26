import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove fields that are not in the DTO
      forbidNonWhitelisted: true, // and answer 400 if someone sends them
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
