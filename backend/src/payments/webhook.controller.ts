import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private prisma: PrismaService) {}

  @Post('mercadopago')
  async handleMercadoPagoWebhook(@Body() data: any) {
    try {
      console.log('🔔 Webhook recebido do Mercado Pago:', data);

      // O Mercado Pago envia um evento com o ID do pagamento
      const { action, data: mpData } = data;

      if (action === 'payment.created' || action === 'payment.updated') {
        const paymentId = mpData?.id;
        
        if (!paymentId) {
          console.error('❌ ID do pagamento não encontrado');
          return { success: false };
        }

        // Buscar a fatura com este mercadoPagoId
        const invoice = await this.prisma.invoice.findFirst({
          where: { mercadoPagoId: paymentId.toString() }
        });

        if (!invoice) {
          console.error('❌ Fatura não encontrada para o ID:', paymentId);
          return { success: false };
        }

        // Buscar detalhes do pagamento para verificar status
        // (Você teria que chamar a API do Mercado Pago aqui)
        // Por enquanto, vamos atualizar baseado na ação

        let newStatus = invoice.status;

        if (action === 'payment.updated') {
          // Se foi atualizado, provavelmente foi pago
          newStatus = 'paid';
        }

        // Atualizar a fatura no banco
        const updatedInvoice = await this.prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: newStatus },
          include: { client: true }
        });

        console.log('✅ Fatura atualizada:', {
          id: updatedInvoice.id,
          status: updatedInvoice.status
        });

        return { success: true, invoice: updatedInvoice };
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      return { success: false, error: error.message };
    }
  }

  // Health check endpoint
  @Post('mercadopago/test')
  testWebhook() {
    return { status: 'webhook working' };
  }
}
