import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';

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
