import { Injectable, InternalServerErrorException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: string) {
    try {
      return await this.prisma.appointment.create({
        data: {
          ...data,
          userId,
        },
        include: { client: true },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao criar agendamento.');
    }
  }

  async findAll(userId: string) {
    try {
      return await this.prisma.appointment.findMany({
        where: { userId },
        include: { client: true },
        orderBy: { date: 'asc' },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao buscar agendamentos.');
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
        include: { client: true },
      });

      if (!appointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }

      if (appointment.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para acessar este agendamento');
      }

      return appointment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao buscar agendamento.');
    }
  }

  async update(id: string, data: any, userId: string) {
    try {
      await this.ensureOwnership(id, userId);

      return await this.prisma.appointment.update({
        where: { id },
        data,
        include: { client: true },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao atualizar agendamento.');
    }
  }

  async delete(id: string, userId: string) {
    try {
      await this.ensureOwnership(id, userId);

      await this.prisma.appointment.delete({
        where: { id },
      });

      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao deletar agendamento.');
    }
  }

  private async ensureOwnership(id: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este agendamento');
    }
  }
}
