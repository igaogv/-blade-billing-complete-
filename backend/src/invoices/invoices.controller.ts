import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private invoicesService: InvoicesService,
    private whatsappService: WhatsappService,
  ) {}

  @Get()
  async findAll() {
    return this.invoicesService.findAll();
  }

  @Post()
  async create(@Body() data: any) {
    return this.invoicesService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.invoicesService.delete(id);
  }

  @Post(':id/send-whatsapp')
  async sendWhatsapp(@Param('id') id: string) {
    try {
      const invoice = await this.invoicesService.findOne(id);
      
      if (!invoice) {
        throw new Error('Fatura não encontrada');
      }

      if (!invoice.client) {
        throw new Error('Cliente não encontrado na fatura');
      }

      const valor = (invoice as any).value || (invoice as any).amount || 0;
      const pixCode = invoice.pixQrCode || 'Código PIX não disponível';
      const vencimento = new Date(invoice.dueDate).toLocaleDateString('pt-BR');

      console.log('Enviando WhatsApp para:', invoice.client.phone);
      console.log('Valor:', valor);
      console.log('PIX Code:', pixCode);

      await this.whatsappService.enviarMensagem(
        invoice.client.phone,
        pixCode,
        valor,
        vencimento,
      );

      return { success: true, message: 'Mensagem enviada com sucesso!' };
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      throw error;
    }
  }
}
