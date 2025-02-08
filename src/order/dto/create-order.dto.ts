import { IsNumber, IsString, IsPositive, IsOptional, IsMobilePhone, IsNotEmpty, ValidateNested, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';

enum PaymentMethod {
  PIX = 'PIX',
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

class CreateOrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  clientPhoneNumber: string;

  @IsNumber()
  organizationId: number;

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
