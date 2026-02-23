import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ClientPayload {
  name: string;
  email: string;
  phone: string;
}

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    if (client.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este cliente');
    }
    return client;
  }

  async create(data: ClientPayload, userId: string) {
    return this.prisma.client.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, data: Partial<ClientPayload>, userId: string) {
    await this.ensureExists(id, userId);

    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.ensureExists(id, userId);

    await this.prisma.client.delete({
      where: { id },
    });

    return { success: true };
  }

  private async ensureExists(id: string, userId: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    if (client.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este cliente');
    }
  }
}
