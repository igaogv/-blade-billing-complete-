import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService, WhatsappService],
})
export class InvoicesModule {}
