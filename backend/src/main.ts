import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ APENAS para local development
  // Em produção (Vercel), o prefixo '/api' é definido em api/index.ts
  const env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    app.setGlobalPrefix('api');
  }
  
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
  
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0', () => {
    console.log(`
✅ Backend rodando na porta ${port}`);
    console.log(`🌐 Ambiente: ${env}`);
    console.log(`🔗 CORS habilitado para: QUALQUER ORIGEM`);
    console.log(`📂 Prefixo de API: /api`);
    console.log(`🚀 API disponível em http://localhost:${port}/api\n`);
  });
}

bootstrap().catch(err => {
  console.error('❌ Erro ao iniciar backend:', err.message);
  process.exit(1);
});
