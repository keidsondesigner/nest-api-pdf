import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Configuração para suportar uploads maiores
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Adiciona validação global
  app.useGlobalPipes(new ValidationPipe());

  // Habilita CORS
  app.enableCors();

  await app.listen(3000);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Erro ao iniciar a aplicação:', error);
  process.exit(1);
});
