import { Controller, Get } from '@nestjs/common';

@Controller('appointments')
export class AppointmentsController {
  @Get()
  findAll() {
    return [
      {
        id: '1',
        clientName: 'Cliente Exemplo',
        date: '2025-12-20',
        hour: '15:00',
        service: 'Corte de cabelo',
        status: 'Confirmado',
      }
    ];
  }
}
