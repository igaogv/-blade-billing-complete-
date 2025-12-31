import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Module({
  controllers: [PaymentsController],
  providers: [WhatsappService],
})
export class PaymentsModule {}
