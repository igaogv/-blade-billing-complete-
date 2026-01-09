import { Module } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MercadopagoController],
  providers: [MercadopagoService, PrismaService],
  exports: [MercadopagoService],
})
export class MercadopagoModule {}
