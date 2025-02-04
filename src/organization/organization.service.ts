import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Organization, Prisma } from '@prisma/client';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
  ): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: organizationWhereUniqueInput,
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrganizationWhereUniqueInput;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }): Promise<Organization[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.organization.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return this.prisma.organization.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.OrganizationWhereUniqueInput;
    data: Prisma.OrganizationUpdateInput;
  }): Promise<Organization> {
    const { where, data } = params;
    return this.prisma.organization.update({
      data,
      where,
    });
  }

  async remove(
    where: Prisma.OrganizationWhereUniqueInput,
  ): Promise<Organization> {
    return this.prisma.organization.delete({
      where,
    });
  }
}
