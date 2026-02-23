// backend/src/clients/clients.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.clientsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.clientsService.findOne(id, userId);
  }

  @Post()
  create(
    @Body()
    data: { name: string; email: string; phone: string },
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.clientsService.create(data, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    data: { name?: string; email?: string; phone?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.clientsService.update(id, data, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.clientsService.delete(id, userId);
  }
}
