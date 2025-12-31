import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly phone_id = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private readonly token = process.env.WHATSAPP_ACCESS_TOKEN;
  private readonly whatsapp_api_url = `https://graph.facebook.com/v22.0/${this.phone_id}/messages`;

  async enviarMensagem(
    telefone: string,
    pixCode: string,
    valor: number,
    vencimento: string,
  ) {
    if (!this.token || !this.phone_id) {
      throw new Error('Variáveis de ambiente WhatsApp não configuradas');
    }

    const phoneClean = telefone.replace(/\D/g, '');

    const payload = {
      messaging_product: 'whatsapp',
      to: phoneClean,
      type: 'text',
      text: {
        body: `🔔 *Nova Cobrança*\n\n💰 Valor: R$ ${valor.toFixed(2)}\n📅 Vencimento: ${vencimento}\n\n📋 *Pix Copia e Cola:*\n\`\`\`${pixCode}\`\`\`\n\nPague pelo app do seu banco!`,
      },
    };

    try {
      const response = await axios.post(this.whatsapp_api_url, payload, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error.response?.data || error.message);
      throw new Error('Falha ao enviar mensagem via WhatsApp');
    }
  }
}
