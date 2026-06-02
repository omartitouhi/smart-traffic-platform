import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation globale de tous les DTO (class-validator)
  // whitelist : supprime les champs non déclarés dans le DTO
  // forbidNonWhitelisted : rejette la requête si des champs inconnus sont envoyés
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — origins autorisés via la variable CORS_ORIGIN (virgule-séparée).
  // Ex : CORS_ORIGIN=http://localhost:4200,https://app.example.com
  // Si absent ou vide → toutes les origines cross-origin sont bloquées (false).
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : false;
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
