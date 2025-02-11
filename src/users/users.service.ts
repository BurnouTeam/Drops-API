import { Injectable } from '@nestjs/common';
import { Role, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUserDto } from './dto/public-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        role: true,
      },
    });
  }

  async findByEmail(
    email: string,
    organizationId: number,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email_organizationId: {
          email: email,
          organizationId: organizationId,
        },
      },
      include: {
        role: true,
      },
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    fields?: string;
  }): Promise<Partial<User>[]> {
    const { skip, take, cursor, where, orderBy, fields } = params;
    let select = undefined;
    if (fields){
      const requestedFields = fields.split(',').reduce( (acc, field) => {
        acc[field.trim()] = true;
        return acc;
      }, {} as Record<string, boolean>);
      select = requestedFields
    }

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async findRoles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
    fields?: string;
  }): Promise<Partial<Role>[]> {
    const { skip, take, cursor, where, orderBy, fields } = params;

    return this.prisma.role.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      include: {
        role: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
      include: {
        role: true,
      },
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
      include: {
        role: true,
      },
    });
  }
}
