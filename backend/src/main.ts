import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Em produção (Vercel) o prefixo /api é definido em api/index.ts.
  // Somente em desenvolvimento mantemos aqui para rodar localmente.
  const env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    app.setGlobalPrefix('api');
  }

  // CORS: aceita whitelist configurada e previews da Vercel.
  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [];
  const isAllowedOrigin = (origin?: string): boolean => {
    if (!origin) return true;
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
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    maxAge: 3600, // Cache de 1 hora para preflight
  });

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Backend rodando na porta ${port}`);
    console.log(`🌐 Ambiente: ${env}`);
    const corsLog = configuredOrigins.length
      ? `${configuredOrigins.join(', ')} + *.vercel.app`
      : 'all origins';
    console.log(`🔒 CORS habilitado para: ${corsLog}`);
    console.log(`📍 Prefixo de API: /api`);
    console.log(`🚀 API disponível em http://localhost:${port}/api\n`);
  });
}

bootstrap().catch(err => {
  console.error('❌ Erro ao iniciar backend:', err.message);
  process.exit(1);
});
