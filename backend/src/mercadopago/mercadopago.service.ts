import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface CreatePreferenceDto {
  invoiceId: string;
  amount: number;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

@Injectable()
export class MercadopagoService {
  private readonly logger = new Logger(MercadopagoService.name);
  private readonly accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  private readonly publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;
  private readonly baseUrl = 'https://api.mercadopago.com';
  private readonly webhookUrl =
    process.env.MERCADOPAGO_WEBHOOK_URL ||
    'https://blade-billing-complete.vercel.app/api/mercadopago/webhook';

  constructor(private readonly prisma: PrismaService) {
    if (!this.accessToken) {
      this.logger.warn(
        'MERCADOPAGO_ACCESS_TOKEN not configured. Payment features will not work.',
      );
    }
  }

  /**
   * Create a payment preference
   * Returns init_point (checkout URL) and preference_id
   */
  async createPreference(
    data: CreatePreferenceDto,
  ): Promise<{
    preference_id: string;
    init_point: string;
    sandbox_init_point: string;
    client_id?: string;
  }> {
    try {
      if (!this.accessToken) {
        throw new Error('MercadoPago access token not configured');
      }

      const preferenceData = {
        items: [
          {
            id: data.invoiceId,
            title: data.description,
            unit_price: data.amount,
            quantity: 1,
          },
        ],
        payer: {
          name: data.clientName,
          email: data.clientEmail,
          phone: {
            number: data.clientPhone || '0',
          },
        },
        back_urls: {
          success: 'https://blade-billing-complete.vercel.app/pagamentos?status=success',
          failure: 'https://blade-billing-complete.vercel.app/pagamentos?status=failure',
          pending: 'https://blade-billing-complete.vercel.app/pagamentos?status=pending',
        },
        auto_return: 'approved',
        notification_url: this.webhookUrl,
        external_reference: data.invoiceId,
      };

      const response = await axios.post(
        `${this.baseUrl}/checkout/preferences`,
        preferenceData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Save preference to database for tracking
      await this.prisma.mercadopagoPreference.upsert({
        where: { invoiceId: data.invoiceId },
        update: {
          preferenceId: response.data.id,
          initPoint: response.data.init_point,
          sandboxInitPoint: response.data.sandbox_init_point,
          status: 'active',
        },
        create: {
          invoiceId: data.invoiceId,
          preferenceId: response.data.id,
          initPoint: response.data.init_point,
          sandboxInitPoint: response.data.sandbox_init_point,
          amount: data.amount,
          clientEmail: data.clientEmail,
          status: 'active',
        },
      });

      this.logger.log(
        `Preference created for invoice ${data.invoiceId}: ${response.data.id}`,
      );

      return {
        preference_id: response.data.id,
        init_point: response.data.init_point,
        sandbox_init_point: response.data.sandbox_init_point,
        client_id: response.data.client_id,
      };
    } catch (error) {
      this.logger.error(`Error creating preference: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to create payment preference: ${error.message}`,
      );
    }
  }

  /**
   * Handle webhook notifications from MercadoPago
   * Updates payment status and invoice when payment is received
   */
  async handleWebhook(data: any): Promise<any> {
    try {
      this.logger.debug(`Webhook received: ${JSON.stringify(data)}`);

      if (!data.data || !data.data.id) {
        throw new Error('Invalid webhook payload');
      }

      const paymentId = data.data.id;

      // Fetch payment details from MercadoPago
      const paymentDetails = await this.getPaymentDetails(paymentId);

      if (!paymentDetails) {
        throw new Error(`Payment ${paymentId} not found`);
      }

      const externalReference = paymentDetails.external_reference;
      const status = paymentDetails.status; // approved, pending, rejected
      const amount = paymentDetails.transaction_amount;

      // Update invoice status based on payment status
      if (externalReference) {
        const updateData: any = {
          paymentStatus: status === 'approved' ? 'paid' : status,
          mpPaymentId: paymentId,
          mpStatus: status,
        };

        if (status === 'approved') {
          updateData.paidAt = new Date();
        }

        await this.prisma.invoice.update({
          where: { id: externalReference },
          data: updateData,
        });

        // Save payment record
        await this.prisma.mercadopagoPayment.create({
          data: {
            paymentId,
            invoiceId: externalReference,
            amount,
            status,
            mpResponse: paymentDetails,
          },
        });

        this.logger.log(
          `Payment ${paymentId} processed for invoice ${externalReference}: ${status}`,
        );

        // TODO: Send WhatsApp notification to client if payment approved
        // await this.whatsappService.notifyPaymentConfirmed(invoiceId);
      }

      return {
        success: true,
        paymentId,
        status,
      };
    } catch (error) {
      this.logger.error(`Webhook processing error: ${error.message}`);
      throw new InternalServerErrorException(
        `Webhook processing failed: ${error.message}`,
      );
    }
  }

  /**
   * Get payment status by payment ID from MercadoPago API
   */
  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      return await this.getPaymentDetails(paymentId);
    } catch (error) {
      this.logger.error(
        `Error fetching payment status: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to get payment status: ${error.message}`,
      );
    }
  }

  /**
   * Internal method to fetch payment details from MercadoPago API
   */
  private async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      if (!this.accessToken) {
        throw new Error('MercadoPago access token not configured');
      }

      const response = await axios.get(
        `${this.baseUrl}/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching payment details: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all payments for current month
   */
  async getMonthlyPayments(): Promise<any[]> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const payments = await this.prisma.mercadopagoPayment.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return payments;
    } catch (error) {
      this.logger.error(`Error fetching monthly payments: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to fetch payments: ${error.message}`,
      );
    }
  }

  /**
   * Get preference by invoice ID
   */
  async getPreferenceByInvoiceId(invoiceId: string): Promise<any> {
    try {
      const preference = await this.prisma.mercadopagoPreference.findUnique({
        where: { invoiceId },
      });

      if (!preference) {
        throw new Error(`Preference not found for invoice ${invoiceId}`);
      }

      return preference;
    } catch (error) {
      this.logger.error(
        `Error fetching preference: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to fetch preference: ${error.message}`,
      );
    }
  }

  /**
   * Get public key for frontend integration
   */
  getPublicKey(): string {
    if (!this.publicKey) {
      this.logger.warn('MERCADOPAGO_PUBLIC_KEY not configured');
      return '';
    }
    return this.publicKey;
  }
}
