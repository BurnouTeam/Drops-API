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
    const input = {
      organizationId: createOrderDto.organizationId,
      totalPrice: createOrderDto.totalPrice,
      status: createOrderDto.status,
      organization: {
        connect: {
          id: createOrderDto.organizationId,
        },
      },
      client: {
        connect: {
          phoneNumber: createOrderDto.clientPhoneNumber,
        },
      },
    };
    return this.orderService.create(input);
  }

  @Get(':organizationId')
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('fields') fields?: string,
  ) {
    return this.orderService.find({ fields, where: { organizationId } });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.order({ id });
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove({ id });
  }
}
