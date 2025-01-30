import { IsNumber, IsString, IsPositive, IsOptional, IsMobilePhone, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  clientPhoneNumber: string;

  @IsNumber()
  organizationId: number;

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsString()
  @IsOptional()
  status?: string;

  items: { productId: number; quantity: number; price: number }[];
}
