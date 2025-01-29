import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNumber()
  organizationId: number;

  @IsNotEmpty()
  password: string;
}
