import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const totalClients = await this.prisma.client.count({
      where: { userId },
    });
    
    const totalInvoices = await this.prisma.invoice.count({
      where: { userId },
    });
    
    const totalReceivedResult = await this.prisma.invoice.aggregate({
      where: { userId, status: 'PAID' },
      _sum: { value: true },
    });
    
    const totalPendingResult = await this.prisma.invoice.aggregate({
      where: { userId, status: 'PENDING' },
      _sum: { value: true },
    });

    // Ensure we always return numbers, never null or undefined
    const totalReceived = totalReceivedResult._sum?.value ?? 0;
    const totalPending = totalPendingResult._sum?.value ?? 0;

    console.log('📊 Dashboard Stats:', {
      totalClients,
      totalInvoices,
      totalReceived,
      totalPending,
    });

    return {
      totalClients: totalClients ?? 0,
      totalInvoices: totalInvoices ?? 0,
      totalReceived: Number(totalReceived) || 0,
      totalPending: Number(totalPending) || 0,
    };
  }
}
