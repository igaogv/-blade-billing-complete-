import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { WebhookController } from './webhook.controller';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Module({
  controllers: [PaymentsController, WebhookController],
  providers: [WhatsappService],
})
export class PaymentsModule {}
