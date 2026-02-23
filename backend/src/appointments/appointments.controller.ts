import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.appointmentsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.appointmentsService.findOne(id, userId);
  }

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.appointmentsService.create(data, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.appointmentsService.delete(id, userId);
  }
}
