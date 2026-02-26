import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import express, { Request, Response } from 'express';

const server = express();
let app: INestApplication | null = null;

async function createApp(): Promise<INestApplication> {
  if (!app) {
    const expressAdapter = new ExpressAdapter(server);
    app = await NestFactory.create(AppModule, expressAdapter, {
      logger: ['error', 'warn', 'log'],
    });

    // CORS - aceita origens configuradas e previews da Vercel.
    const configuredOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
      : [];
    const isAllowedOrigin = (origin?: string): boolean => {
      if (!origin) return true; // requests server-to-server/no-origin
      if (configuredOrigins.length === 0) return true;
      if (configuredOrigins.includes(origin)) return true;
      return /^https:\/\/.*\.vercel\.app$/i.test(origin);
    };

    app.enableCors({
      origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      optionsSuccessStatus: 200,
      maxAge: 3600,
    });

    // Validação global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Prefixo '/api' é definido aqui para Vercel
    app.setGlobalPrefix('api');

    await app.init();

    console.log('✅ NestJS App initialized for Vercel Serverless');
  }
  return app;
}

// Handler para Vercel Serverless Functions
export default async (req: Request, res: Response) => {
  try {
    await createApp();
    return server(req, res);
  } catch (error) {
    console.error('❌ Error in serverless handler:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
