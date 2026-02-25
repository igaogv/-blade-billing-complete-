import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  /**
   * Create a payment preference for an invoice
   * POST /api/mercadopago/create-preference
   */
  @Post('create-preference')
  @HttpCode(201)
  async createPreference(
    @Body()
    body: {
      invoiceId: string;
      amount: number;
      description: string;
      clientName: string;
      clientEmail: string;
      clientPhone?: string;
    },
  ) {
    try {
      if (!body.invoiceId || !body.amount || !body.clientEmail) {
        throw new BadRequestException(
          'Missing required fields: invoiceId, amount, clientEmail',
        );
      }

      const preference = await this.mercadopagoService.createPreference({
        invoiceId: body.invoiceId,
        amount: body.amount,
        description: body.description,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone || '',
      });

      return {
        success: true,
        data: preference,
        message: 'Payment preference created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to create payment preference',
      );
    }
  }

  /**
   * Webhook endpoint for MercadoPago notifications
   * POST /api/mercadopago/webhook
   */
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
  ) {
    try {
      // MercadoPago sends action=payment.created when payment is processed
      if (body.action === 'payment.created' || body.action === 'payment.updated') {
        const result = await this.mercadopagoService.handleWebhook(body);
        return {
          success: true,
          message: 'Webhook processed successfully',
          data: result,
        };
      }

      return {
        success: true,
        message: 'Webhook received',
      };
    } catch (error) {
      console.error('Webhook error:', error);
      // Return 200 even on error to avoid MP retries
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get payment status by payment ID
   * GET /api/mercadopago/payment/:paymentId
   */
  @Get('payment/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    try {
      if (!paymentId) {
        throw new BadRequestException('Payment ID is required');
      }

      const status = await this.mercadopagoService.getPaymentStatus(paymentId);

      return {
        success: true,
        data: status,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to get payment status',
      );
    }
  }

  /**
   * Get all payments for current month
   * GET /api/mercadopago/payments
   */
  @Get('payments')
  async getMonthlyPayments() {
    try {
      const payments = await this.mercadopagoService.getMonthlyPayments();

      return {
        success: true,
        data: payments,
        count: payments.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch payments',
      );
    }
  }

  /**
   * Get payment preference by invoice ID
   * GET /api/mercadopago/preference/:invoiceId
   */
  @Get('preference/:invoiceId')
  async getPreference(@Param('invoiceId') invoiceId: string) {
    try {
      if (!invoiceId) {
        throw new BadRequestException('Invoice ID is required');
      }

      const preference = await this.mercadopagoService.getPreferenceByInvoiceId(
        invoiceId,
      );

      return {
        success: true,
        data: preference,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch preference',
      );
    }
  }
}
