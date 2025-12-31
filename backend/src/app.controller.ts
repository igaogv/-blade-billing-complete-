import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return {
      message: '✅ Backend is running!',
      api: 'https://esse-aqui-midia-backend.vercel.app/api',
      health: 'https://esse-aqui-midia-backend.vercel.app/api/health',
      swagger: 'https://esse-aqui-midia-backend.vercel.app/api/docs',
    };
  }

  @Get('health')
  health() {
    return { status: 'ok', message: 'Backend is running!' };
  }
}
