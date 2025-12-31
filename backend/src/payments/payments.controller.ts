import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Controller('payments')
export class PaymentsController {
  constructor(private whatsappService: WhatsappService) {}

  @Post('send-whatsapp')
  async sendWhatsapp(@Body() data: any) {
    const { telefone, pixCode, valor, vencimento } = data;

    await this.whatsappService.enviarMensagem(
      telefone,
      pixCode,
      valor,
      vencimento,
    );

    return { success: true, message: 'Mensagem enviada!' };
  }
}
