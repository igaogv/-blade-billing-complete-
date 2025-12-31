import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  clientId: string;

  @IsNumber()
  value: number;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  status?: string;
}
