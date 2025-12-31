import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error(
        '\n\n❌ ERRO CRÍTICO: DATABASE_URL não definida!\n' +
        'Verifique se o arquivo .env existe e tem DATABASE_URL=postgresql://...\n\n'
      );
    }

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      errorFormat: 'pretty',
      log: ['error', 'warn'],
    });

    console.log('\n✅ DATABASE_URL carregada com sucesso!');
    console.log(`📝 Conectando em: ${databaseUrl.substring(0, 50)}...\n`);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma conectado ao banco de dados!');
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco de dados:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
