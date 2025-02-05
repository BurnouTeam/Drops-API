import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
  IsObject,
} from 'class-validator';
import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsNumber()
  organizationId: number;
}

export class CreateProductWithTypeDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsNumber()
  organizationId: number;

  @IsObject()
  type: ProductType;
}

export class CreateProductWithType {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsNumber()
  organizationId: number;

  @IsNumber()
  typeId: number;
}

export class CreateProductTypeDto {
  @IsString()
  name: string;

  @IsNumber()
  organizationId: number;
}
