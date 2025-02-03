import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

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

  async findAllOrders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }): Promise<Record<string, Order[]>> {
    const { skip, take, cursor, where, orderBy } = params;

    const orders = await this.prisma.order.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const newOrders: Record<string, Order[]> = {
      pending: [],
      shipped: [],
      completed: [],
      recused: [],
    };

    // Preenche os arrays corretos com base no status da ordem
    orders.forEach((order) => {
      const statusKey = order.status.toLowerCase();
      const formattedTime = order.createdAt.toLocaleTimeString('en-US', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      order.createdAt = formattedTime as unknown as Date;
      if (newOrders[statusKey]) {
        newOrders[statusKey].push(order);
      }
    });
    // return orders.reduce(
    //   (acc, order) => {
    //     const statusKey = `${order.status.toLowerCase()}`;
    //     if (!acc[statusKey]) {
    //       acc[statusKey] = [];
    //     }
    //     acc[statusKey].push(order);
    //     return acc;
    //   },
    //   {} as Record<string, Order[]>,
    // );
    return newOrders;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, clientPhoneNumber, organizationId } = createOrderDto;

    const order = await this.prisma.$transaction(async (prisma) => {
      const createdOrder = await prisma.order.create({
        data: {
          totalPrice: 0,
          status: 'pending',
          organization: {
            connect: {
              id: organizationId,
            },
          },
          client: {
            connect: {
              phoneNumber: clientPhoneNumber,
            },
          },
        },
      });

      let totalPrice = 0;
      const orderItems = [];

      for (const item of items) {
        const { productId, quantity } = item;

        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Producti with id: ${productId} not found`,
          );
        }

        if (product.quantity < quantity) {
          throw new BadRequestException(
            `Insufficient stock for product with id ${productId}`,
          );
        }

        await prisma.product.update({
          where: { id: productId, organizationId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        const price = product.price * quantity;
        totalPrice += price;

        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId,
            quantity,
            price: product.price,
          },
        });

        orderItems.push(orderItem);
      }

      await prisma.order.update({
        where: { id: createdOrder.id, organizationId },
        data: {
          totalPrice,
        },
      });

      return {
        ...createdOrder,
        totalPrice,
        items: orderItems,
      };
    });

    return order;
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

  async evolveOrderStatus(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Order> {
    const { where, data } = params;

    const newStatus = data.status === 'pending' ? 'shipped' : 'completed';

    return this.prisma.order.update({
      data: { status: newStatus },
      where,
    });
  }

  async createDefaultOrder() {
    return 'yes';
  }

  async recuseOrder(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Order> {
    const { where, data } = params;

    if (data.status === 'completed') {
      throw new BadRequestException(
        `We cannot recuse an order already completed`,
      );
    }

    return this.prisma.order.update({
      data: { status: 'recused' },
      where,
    });
  }

  async deleteOrder(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
    const orderToDelete = await this.prisma.order.findUnique({
      where,
      include: {
        items: true,
      },
    });

    if (!orderToDelete) {
      throw new Error('Order not Found');
    }

    const productUpdates = orderToDelete.items.map((orderItem) => {
      return this.prisma.product.update({
        where: {
          id: orderItem.productId,
          organizationId: orderToDelete.organizationId,
        },
        data: {
          quantity: {
            increment: orderItem.quantity,
          },
        },
      });
    });

    // Perform the product updates in a transaction to ensure consistency
    await this.prisma.$transaction(productUpdates);

    return this.prisma.order.delete({
      where,
      include: {
        items: true,
      },
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

  log() {
    this.logger.log('Hello');
  }

  async getTodaysOrdersAndCompletedSum(
    time: string,
    organizationId: number,
  ): Promise<{
    ordersCount: number;
    completedSum: number;
  }> {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (time) {
      case 'day':
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = today;
        break;
      case 'month':
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );
        startDate.setUTCHours(0, 0, 0, 0);
        startDate.setUTCDate(1);
        endDate = today;
        break;
      default:
        break;
    }

    try {
      const allOrdersCount = await this.prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
          organizationId,
        },
      });

      const completedSum = await this.prisma.order.aggregate({
        where: {
          updatedAt: {
            gte: startDate,
            lt: endDate,
          },
          status: 'completed',
          organizationId,
        },
        _sum: {
          totalPrice: true,
        },
      });

      return {
        ordersCount: allOrdersCount,
        completedSum: completedSum._sum.totalPrice ?? 0,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
}
