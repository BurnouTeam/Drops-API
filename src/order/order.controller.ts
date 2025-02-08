import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Post('default')
  createDefaultOrder(@Body() createOrderDto: CreateOrderDto) {
    // return this.orderService.createDefaultOrder();
  }

  @Get('client/:clientPhoneNumber/:organizationId')
  getClientDefaultOrder(
    @Param('clientPhoneNumber') clientPhoneNumber: string,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    return this.orderService.getDefaultOrderForClient({
      clientId: clientPhoneNumber,
      organizationId,
    });
  }

  // @Get(':organizationId')
  // findAll(
  //   @Param('organizationId', ParseIntPipe) organizationId: number,
  //   @Query('fields') fields?: string,
  // ) {
  //   return this.orderService.find({
  //     where: { organizationId },
  //   });
  // }

  @Get(':organizationId')
  findAllByStatus(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('fields') fields?: string,
  ) {
    return this.orderService.findAllOrders({
      where: { organizationId },
    });
  }

  @Get('overview/:time/:organizationId')
  getOrderOverview(
    @Param('time') time: string,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    return this.orderService.getTodaysOrdersAndCompletedSum(
      time,
      organizationId,
    );
  }

  @Get(':organizationId/:id')
  findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.orderService.order({
      where: {
        id,
        organizationId,
      },
      include: {
        client: true,
        items: true,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const { clientPhoneNumber, totalPrice, status, items } = updateOrderDto;
    const params = {
      where: { id },
      data: {
        totalPrice: totalPrice,
        status: status,
        client: clientPhoneNumber
          ? { connect: { phoneNumber: clientPhoneNumber } }
          : undefined,
      },
    };
    return this.orderService.update(params);
  }

  @Patch('/next/:id')
  evolveOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const { organizationId, status } = updateOrderDto;
    const params = {
      where: { id, organizationId },
      data: {
        status,
      },
    };
    return this.orderService.evolveOrderStatus(params);
  }

  @Patch('/cancel/:id')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const { organizationId, status } = updateOrderDto;
    const params = {
      where: { id, organizationId },
      data: { status },
    };
    return this.orderService.recuseOrder(params);
  }

  @Delete(':organizationId/:id')
  deleteOrder(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.orderService.deleteOrder({ id, organizationId });
  }

  @Get('products/by/org/:organizationId')
  async getOrderProductsByOrganizationId(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<any> {
    return this.orderService.getOrderProductsByOrganizationId(organizationId);
  }

}
