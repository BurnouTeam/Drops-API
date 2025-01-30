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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const input = {
      name: createProductDto.name,
      price: createProductDto.price,
      quantity: createProductDto.quantity,
      details: createProductDto.details,
      imageUrl: createProductDto.imageUrl,
      organization: {
        connect: { id: createProductDto.organizationId },
      },
    };
    return this.productService.create(input);
  }

  @Get(':organizationId')
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('fields') fields?: string,
  ) {
    return this.productService.find({ fields, where: { organizationId } });
  }

  @Get(':organizationId/:id')
  findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.product({
      where: { id, organizationId },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const params = {
      where: { id, organizationId: updateProductDto.organizationId },
      data: updateProductDto,
    };
    return this.productService.update(params);
  }

  @Delete(':organizationId/:id')
  remove(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    const where = { id: productId, organizationId };
    return this.productService.remove(where);
  }
}
