import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
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
  organization: number;

  @Exclude()
  refreshToken: string;
}
