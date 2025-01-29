import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  organizationId: number;

  @IsString()
  @IsOptional()
  profilePhoto: string;

  @Exclude()
  refreshToken: string;
}
