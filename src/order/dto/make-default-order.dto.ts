import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class MakeDefaultOrderDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsNumber()
  @IsNotEmpty()
  organizationId: number;
}
