import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateBillingDto {
  @IsNumber()
  amount!: number;

  @IsDateString()
  dueDate!: string;

  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  paymentMethod!: string;
}
