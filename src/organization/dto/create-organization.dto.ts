import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  profilePhoto: string;
}
