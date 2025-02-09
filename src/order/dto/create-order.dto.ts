import { IsNumber, IsString, IsPositive, IsOptional, IsMobilePhone, IsNotEmpty, ValidateNested, IsArray, IsEnum, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';
import { PaymentMethod } from '@prisma/client';


class CreateOrderItemDto {
  @IsNotEmpty()
  @IsArray()
  productId: number;

  @IsInt()
  quantity: number;

  @IsInt()
  orderId?: number;

  @IsPositive()
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

  @IsBoolean()
  isDefault: boolean = false;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
