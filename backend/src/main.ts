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

  // CORS whitelist: usa CORS_ORIGIN se presente, senão cai no default seguro.
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : true; // allow all if not specified to avoid preview-domain CORS blocks

  app.enableCors({
    origin: corsOrigin,
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
    const corsLog = Array.isArray(corsOrigin) ? corsOrigin.join(', ') : 'all origins';
    console.log(`🔒 CORS habilitado para: ${corsLog}`);
    console.log(`📍 Prefixo de API: /api`);
    console.log(`🚀 API disponível em http://localhost:${port}/api\n`);
  });
}

bootstrap().catch(err => {
  console.error('❌ Erro ao iniciar backend:', err.message);
  process.exit(1);
});
