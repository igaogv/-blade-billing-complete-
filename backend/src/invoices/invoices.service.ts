import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import { randomUUID } from 'crypto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  private readonly mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  private readonly mercadoPagoUrl = 'https://api.mercadopago.com/v1/payments';

  async findAll(userId: string) {
    return this.prisma.invoice.findMany({
      where: { userId },
      include: {
        client: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    if (invoice.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar esta fatura');
    }

    return invoice;
  }

  async create(data: any, userId: string) {
    const pixPayment = await this.createMercadoPagoPayment(data);

    return this.prisma.invoice.create({
      data: {
        clientId: data.clientId,
        userId,
        value: data.value,
        dueDate: data.dueDate,
        status: 'PENDING',
        pixQrCode: pixPayment.qrCode,
        mercadoPagoPaymentId: String(pixPayment.paymentId),
      },
      include: {
        client: true,
      },
    });
  }

  async createMercadoPagoPayment(invoiceData: any) {
    try {
      const idempotencyKey = randomUUID();

      const payload = {
        transaction_amount: invoiceData.value,
        description: `Cobrança - ${invoiceData.clientId}`,
        payment_method_id: 'pix',
        payer: {
          email: 'cliente@email.com',
        },
      };

      console.log('Criando pagamento no Mercado Pago...');
      console.log('Idempotency Key:', idempotencyKey);

      const response = await axios.post(this.mercadoPagoUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.mercadoPagoToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
      });

      console.log('✅ Pagamento criado no Mercado Pago:', response.data.id);

      return {
        paymentId: response.data.id,
        qrCode: response.data.point_of_interaction?.transaction_data?.qr_code || 'PIX não disponível',
        qrCodeBase64: response.data.point_of_interaction?.transaction_data?.qr_code_base64,
      };
    } catch (error: any) {
      console.error('❌ Erro ao criar pagamento no Mercado Pago:', error?.response?.data || error.message);
      throw new Error('Erro ao gerar PIX no Mercado Pago');
    }
  }

  async delete(id: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    
    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    if (invoice.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar esta fatura');
    }

    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}
