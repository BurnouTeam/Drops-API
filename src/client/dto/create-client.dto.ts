import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsPostalCode,
  IsMobilePhone,
  IsPositive,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('pt-BR')
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @IsNotEmpty()
  @IsInt()
  organizationId: number;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsOptional()
  complement: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  @IsPostalCode('BR')
  cep: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
