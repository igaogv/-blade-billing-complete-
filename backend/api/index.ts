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
    
    // Adicionar prefixo global para API
    app.setGlobalPrefix('api');
    
    // CORS - Configurado para aceitar qualquer origem
    app.enableCors({
      origin: '*', // Aceita TODAS as origens
      credentials: false, // Desabilitar credentials quando origin é *
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
      exposedHeaders: ['Content-Length', 'Content-Type'],
      optionsSuccessStatus: 200,
      maxAge: 86400 // 24 horas
    });
    
    await app.init();
  }
  return app;
}

export default async (req: Request, res: Response) => {
  // Adicionar headers CORS manualmente também
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Responder imediatamente para OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  await createApp();
  return server(req, res);
};