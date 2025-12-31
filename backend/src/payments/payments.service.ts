import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private client: any;

  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    
    console.log('🔑 Mercado Pago Access Token configurado:', accessToken ? 'SIM' : 'NÃO');
    
    if (!accessToken) {
      console.error('❌ MERCADOPAGO_ACCESS_TOKEN não encontrado no .env');
    }

    this.client = new MercadoPagoConfig({ 
      accessToken,
      options: { timeout: 5000 }
    });
  }

  async createPayment(data: {
    amount: number;
    description: string;
    payerEmail: string;
    payerName: string;
    payerCpf?: string;
  }) {
    try {
      console.log('📝 Criando pagamento PIX:', {
        amount: data.amount,
        email: data.payerEmail,
        name: data.payerName
      });

      const payment = new Payment(this.client);

      const body = {
        transaction_amount: data.amount,
        description: data.description,
        payment_method_id: 'pix',
        payer: {
          email: data.payerEmail,
          first_name: data.payerName.split(' ')[0],
          last_name: data.payerName.split(' ').slice(1).join(' ') || data.payerName
        }
      };

      console.log('📤 Enviando para Mercado Pago:', JSON.stringify(body, null, 2));

      const response = await payment.create({ body });
      
      console.log('✅ Resposta Mercado Pago:', {
        id: response.id,
        status: response.status,
        pixQrCode: response.point_of_interaction?.transaction_data?.qr_code,
        pixUrl: response.point_of_interaction?.transaction_data?.ticket_url
      });

      return {
        id: response.id,
        status: response.status,
        boletoUrl: response.point_of_interaction?.transaction_data?.ticket_url || null,
        pixQrCode: response.point_of_interaction?.transaction_data?.qr_code || null,
        expirationDate: response.date_of_expiration
      };
    } catch (error) {
      console.error('❌ Erro ao criar pagamento:', error.message || error);
      if (error.response) {
        console.error('Detalhes API:', error.response.data);
      }
      throw new Error('Falha ao gerar pagamento');
    }
  }
}
