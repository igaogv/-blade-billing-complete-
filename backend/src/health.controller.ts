import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  root() {
    return {
      status: 'online',
      message: '✅ Backend is running!',
      timestamp: new Date(),
      documentation: '/api/docs',
    };
  }

  @Get('status')
  status() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }
}
