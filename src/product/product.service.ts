import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async product(params: {
    include?: Prisma.ProductInclude;
    where?: Prisma.ProductWhereUniqueInput;
  }): Promise<Product | null> {
    const { where, include } = params;
    return this.prisma.product.findUnique({
      where,
      include,
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    fields?: string;
  }): Promise<Partial<Product>[]> {
    const { skip, take, cursor, where, orderBy, fields } = params;

    let select = undefined;
    if (fields) {
      const requestedFields = fields.split(',').reduce(
        (acc, field) => {
          acc[field.trim()] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      select = requestedFields;
    }

    return this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductUpdateInput;
  }): Promise<Product> {
    const { where, data } = params;
    return this.prisma.product.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    return this.prisma.product.delete({
      where,
    });
  }
}
