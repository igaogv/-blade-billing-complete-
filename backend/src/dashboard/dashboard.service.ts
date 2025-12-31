import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalClients = await this.prisma.client.count();
    const totalInvoices = await this.prisma.invoice.count();
    
    const totalReceivedResult = await this.prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { value: true },
    });
    
    const totalPendingResult = await this.prisma.invoice.aggregate({
      where: { status: 'PENDING' },
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
