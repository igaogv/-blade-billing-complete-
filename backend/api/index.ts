import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import express, { Request, Response } from 'express';

const server = express();
let app: INestApplication | null = null;

async function createApp(): Promise<INestApplication> {
  if (!app) {
    const expressAdapter = new ExpressAdapter(server);
    app = await NestFactory.create(AppModule, expressAdapter);

    // O prefixo '/api' é definido em src/main.ts
    // NÃO adicionar novamente aqui para evitar duplicação
    
    // CORS - Aceita qualquer origem (wildcard com credenciais)
    // Isso funciona melhor em produção com Vercel que muda URLs dinâmicamente
    app.enableCors({
      origin: true, // ✅ Aceita QUALQUER origem
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 200,
      maxAge: 3600 // Cache de 1 hora para preflight requests
    });
    
    await app.init();
  }
  return app;
}

export default async (req: Request, res: Response) => {
  await createApp();
  return server(req, res);
};
