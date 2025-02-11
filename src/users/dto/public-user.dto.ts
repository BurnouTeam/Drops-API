import { Expose, Exclude, Type } from 'class-transformer';
export class PublicRoleDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Exclude()
  organizationId: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}

export class PublicUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  profilePhoto: string;

  @Exclude()
  roleId: number;

  @Type(() => PublicRoleDto)
  @Expose()
  role: PublicRoleDto;

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
