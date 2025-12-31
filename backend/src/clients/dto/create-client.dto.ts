import { IsEmail, IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsNumber()
  monthlyValue!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['BOLETO', 'PIX', 'CREDIT_CARD'])
  paymentMethod?: string;

  @IsOptional()
  @IsNumber()
  billingDay?: number;
}
