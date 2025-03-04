import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DefaultOrder, Order, Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateDefaultOrderDto } from './dto/create-default-order.dto';
import { OrderStatus } from './entities/order.entity';
import { WebsocketEventsGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private prisma: PrismaService,
    private readonly websocketGateway: WebsocketEventsGateway,
  ) {}

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
    return newOrders;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      items,
      clientPhoneNumber,
      isDefault,
      organizationId,
      paymentMethod,
    } = createOrderDto;

    const order = await this.prisma.$transaction(async (prisma) => {
      const createdOrder = await prisma.order.create({
        data: {
          default: isDefault,
          totalPrice: 0,
          status: 'pending',
          paymentMethod: paymentMethod,
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
        include: {
          client: true,
        },
      });

      let totalPrice = 0;
      const orderItems = [];

      for (const item of items) {
        const { productId, quantity } = item;

        const product = await prisma.product.findUnique({
          where: {
            id: productId,
            organization: {
              id: organizationId,
            },
          },
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
          include: {
            product: true,
          },
        });

        orderItems.push(orderItem);
      }

      await prisma.order.update({
        where: { id: createdOrder.id, organizationId },
        data: {
          totalPrice,
          items: {
            connect: orderItems.map((item) => ({ id: item.id })),
          },
        },
      });
      // Create PaymentDetails based on the payment method
      const paymentDetails = await prisma.paymentDetails.create({
        data: {
          orderId: createdOrder.id,
          paidAmount: 0, // We assume the payment has not been made at this point
          status: 'PENDING', // Payment status is pending initially
          // TODO: Here you can add logic to generate the Pix code or transaction ID
          // pixCode: paymentMethod === 'PIX' ? await this.generatePixCode(createdOrder.id, totalPrice) : null,
          // transactionId: paymentMethod === 'CREDIT_CARD' ? await this.processCreditCardPayment() : null,
        },
      });

      const formattedTime = createdOrder.createdAt.toLocaleTimeString('en-US', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      this.websocketGateway.sendUpdate({
        message: 'New order created',
        data: {
          ...createdOrder,
          createdAt: formattedTime,
          totalPrice,
          items: orderItems,
          paymentDetails: paymentDetails,
        },
      });
      return {
        ...createdOrder,
        totalPrice,
        items: orderItems,
        paymentDetails: paymentDetails,
      };
    });

    return order;
  }

  async createDefaultOrderFromOrder(
    createDefaultOrderDto: CreateDefaultOrderDto,
  ): Promise<DefaultOrder> {
    const { orderId, organizationId } = createDefaultOrderDto;
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, organizationId },
      include: { items: true, client: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!order.client) {
      throw new BadRequestException(
        `Order with ID ${orderId} dont have any Client`,
      );
    }

    const client = order.client;

    return this.prisma.$transaction(async (prisma) => {
      // Create DefaultOrder with associated DefaultOrderItems
      const defaultOrder = await prisma.defaultOrder.create({
        data: {
          paymentMethod: order.paymentMethod,
          organization: {
            connect: {
              id: order.organizationId,
            },
          },
          client: {
            connect: {
              phoneNumber: client.phoneNumber,
            },
          },
          items: {
            create: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });

      // Update the client to associate with the new default order
      await prisma.client.update({
        where: { phoneNumber: client.phoneNumber },
        data: {
          defaultOrderId: defaultOrder.id,
        },
      });

      this.websocketGateway.sendUpdate({
        message: 'New order from default created',
        data: {
          ...defaultOrder,
        },
      });
      return defaultOrder;
    });
  }

  async createDefaultOrderFromProducts(
    createDefaultOrderDto: CreateDefaultOrderDto,
  ): Promise<DefaultOrder> {
    const { items, paymentMethod, organizationId, clientId } =
      createDefaultOrderDto;

    const client = this.prisma.client.findUnique({
      where: {
        phoneNumber: clientId,
        organizationId: organizationId,
      },
    });

    if (!client) {
      throw new BadRequestException(
        `There is no client on that organization with the phone number: ${clientId}`,
      );
    }

    const order = this.prisma.$transaction(async (prisma) => {
      // Create DefaultOrder with associated DefaultOrderItems
      const defaultOrder = await prisma.defaultOrder.create({
        data: {
          paymentMethod: paymentMethod,
          organization: {
            connect: {
              id: organizationId,
            },
          },
          client: {
            connect: {
              phoneNumber: clientId,
            },
          },
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });

      // Update the client to associate with the new default order
      await prisma.client.update({
        where: { phoneNumber: clientId },
        data: {
          defaultOrderId: defaultOrder.id,
        },
      });

      return defaultOrder;
    });
    this.websocketGateway.sendUpdate({
      message: 'New order from products created',
      data: {
        ...order,
      },
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

  async makeAnDefaultOrder(clientId: string, organizationId: number) {
    const client = await this.prisma.client.findUnique({
      where: {
        phoneNumber: clientId,
        organizationId,
      },
      include: {
        defaultOrder: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!client) {
      throw new BadRequestException(`There is no client with ${clientId}`);
    }

    if (!client.defaultOrder) {
      throw new BadRequestException(
        `Client ${clientId} does not have a default order yet`,
      );
    }

    const orderDto = new CreateOrderDto();
    orderDto.clientPhoneNumber = clientId;
    orderDto.organizationId = organizationId;
    orderDto.status = OrderStatus.pending;
    orderDto.paymentMethod = client.defaultOrder.paymentMethod;
    orderDto.isDefault = true;

    const itemsWithUpdatedPrice = await Promise.all(
      client.defaultOrder.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId, organizationId },
          select: { price: true },
        });

        return {
          productId: item.productId,
          quantity: item.quantity,
          templateId: item.templateId,
          price: product?.price ?? 0, // Use actual price or default 0
        };
      }),
    );

    orderDto.items = itemsWithUpdatedPrice;
    const order = await this.createOrder(orderDto);

    if (!order) {
      throw new BadRequestException(
        'The order could not be created from the default Order',
      );
    }

    return order;
  }

  async getDefaultOrderForClient(params: {
    clientId: string;
    organizationId: number;
  }): Promise<DefaultOrder | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        phoneNumber: params.clientId,
        organizationId: params.organizationId,
      },
      include: {
        defaultOrder: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    type: true
                  }
                }
              },
            },
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID ${params.clientId} not found`,
      );
    }

    if (!client.defaultOrder) {
      return null;
    }

    return client.defaultOrder;
  }
}

// TODO: REMOVE FROM HERE
// Example method to generate a Pix code (for illustration purposes)
async function generatePixCode(
  orderId: number,
  totalPrice: number,
): Promise<string> {
  // Logic to generate the Pix code for the order
  return `PixCodeForOrder_${orderId}_${totalPrice}`;
}

// Example method to process a Credit Card payment (for illustration purposes)
async function processCreditCardPayment(): Promise<string> {
  return `TransactionId_${Math.random().toString(36).substring(2)}`;
}
