import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return {
      message: '✅ Backend is running!',
      api: 'https://blade-billing-complete.vercel.app/api',
      health: 'https://blade-billing-complete.vercel.app/api/health',
      swagger: 'https://blade-billing-complete.vercel.app/api/docs',
    };
  }

  // Health moved to HealthController (/api/health)
}
