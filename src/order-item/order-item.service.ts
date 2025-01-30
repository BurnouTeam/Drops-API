import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, OrderItem } from '@prisma/client';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderItemCreateInput): Promise<OrderItem> {
    return this.prisma.orderItem.create({ data });
  }

  async orderItem(params: {
    include?: Prisma.OrderItemInclude;
    where?: Prisma.OrderItemWhereUniqueInput;
  }): Promise<OrderItem | null> {
    const { include, where } = params;
    return this.prisma.orderItem.findUnique({
      where,
      include,
    });
  }

  async update(
    id: number,
    data: Prisma.OrderItemUpdateInput,
  ): Promise<OrderItem> {
    return this.prisma.orderItem.update({
      where: { id },
      data,
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderItemWhereUniqueInput;
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput;
    fields?: string;
  }): Promise<Partial<OrderItem>[]> {
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

    return this.prisma.orderItem.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async remove(where: Prisma.OrderItemWhereUniqueInput): Promise<OrderItem> {
    return this.prisma.orderItem.delete({ where });
  }
}
