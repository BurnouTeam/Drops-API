import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrderItem, Prisma } from '@prisma/client';
import { CreateOrderItemDto } from './order-item/dto/create-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async Order(
    OrderWhereUniqueInput: Prisma.OrderItemWhereUniqueInput,
  ): Promise<OrderItem | null> {
    return this.prisma.orderItem.findUnique({
      where: OrderWhereUniqueInput,
    });
  }

  async Orders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderItemWhereUniqueInput;
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput;
  }): Promise<OrderItem[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.orderItem.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }


  async updateOrderItem(params: {
    where: Prisma.OrderItemWhereUniqueInput;
    data: Prisma.OrderItemUpdateInput;
  }): Promise<OrderItem> {
    const { where, data } = params;
    return this.prisma.orderItem.update({
      data,
      where,
    });
  }

  async deleteOrderItem(
    where: Prisma.OrderItemWhereUniqueInput,
  ): Promise<OrderItem> {
    return this.prisma.orderItem.delete({
      where,
    });
  }
}
