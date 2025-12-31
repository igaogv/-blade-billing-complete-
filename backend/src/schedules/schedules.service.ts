import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService implements OnModuleInit {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    cron.schedule('0 10 * * *', async () => {
      this.logger.log('⚠️ Verificando cobranças vencidas...');
      await this.checkOverdueInvoices();
    });

    this.logger.log('✅ Cron jobs configurados!');
  }

  private async checkOverdueInvoices() {
    try {
      const today = new Date();

      const overdueInvoices = await this.prisma.invoice.findMany({
        where: {
          dueDate: { lt: today },
          status: { in: ['PENDING', 'SENT'] },
        },
      });

      for (const invoice of overdueInvoices) {
        await this.prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'OVERDUE' },
        });
      }

      this.logger.log(
        `✅ Verificação concluída (${overdueInvoices.length} vencidas)`,
      );
    } catch (error) {
      this.logger.error(`❌ Erro: ${error.message}`);
    }
  }
}
