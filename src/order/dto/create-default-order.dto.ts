import { IsNumber, IsString, IsPositive, IsOptional, IsMobilePhone, IsNotEmpty, ValidateNested, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';

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

  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
