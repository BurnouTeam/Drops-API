import { IsNumber, IsString, IsPositive, IsOptional, IsMobilePhone, IsNotEmpty, ValidateNested, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';
import { PaymentMethod } from '@prisma/client';

class CreateDefaultOrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class CreateDefaultOrderDto {
  @IsNotEmpty()
  @IsNumber()
  organizationId: number;

  @IsString()
  clientId?: string;

  @IsNumber()
  orderId?: number;

  @IsArray()
  items?: CreateDefaultOrderItemDto[];

  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}
