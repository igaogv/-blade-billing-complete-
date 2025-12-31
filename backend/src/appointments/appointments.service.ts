import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import outros arquivos/modelos conforme seu projeto

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.appointment.create({ data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao criar agendamento.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.appointment.findMany();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao buscar agendamentos.');
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.appointment.findUnique({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao buscar agendamento.');
    }
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.appointment.update({ where: { id }, data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao atualizar agendamento.');
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.appointment.delete({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro desconhecido ao excluir agendamento.');
    }
  }
}
