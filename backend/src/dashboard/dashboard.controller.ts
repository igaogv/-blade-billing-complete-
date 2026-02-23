import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {  // ✅ Tirou "default"
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.dashboardService.getStats(userId);
  }
}
