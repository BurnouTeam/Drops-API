import { Expose, Exclude } from 'class-transformer';

export class PublicUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  profilePhoto: string;

  @Expose()
  roleId: number;

  @Expose()
  organizationId: number;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
