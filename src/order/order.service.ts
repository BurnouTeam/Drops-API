import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async order(params: {
    include?: Prisma.OrderInclude;
    where?: Prisma.OrderWhereUniqueInput;
  }): Promise<Order | null> {
    const { where, include } = params;
    return this.prisma.order.findUnique({
      where,
      include,
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    include?: Prisma.OrderInclude;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
    fields?: string;
  }): Promise<Partial<Order>[]> {
    const { skip, take, cursor, where, orderBy, include, fields } = params;

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

    return this.prisma.order.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Order> {
    const { where, data } = params;
    return this.prisma.order.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return this.prisma.order.delete({
      where,
    });
  }

  async getOrderProductsByOrganizationId(organizationId: number): Promise<any> {
    const orders = await this.prisma.order.findMany({
      where: { organizationId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Flatten the products from all orders
    const products = orders.reduce((acc, order) => {
      order.items.forEach((item) => {
        acc.push(item.product);
      });
      return acc;
    }, []);

    // return orders;
    return products;
  }
}
