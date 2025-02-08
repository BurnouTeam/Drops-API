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
import {
  CreateProductDto,
  CreateProductTypeDto,
  CreateProductWithType,
  CreateProductWithTypeDto,
} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body()
    createProductDto: CreateProductDto &
      CreateProductWithTypeDto &
      CreateProductWithType,
  ) {
    if (createProductDto.type) {
      return this.productService.createProductAndType(createProductDto);
    }
    if (createProductDto.typeId) {
      const input = {
        name: createProductDto.name,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
        details: createProductDto.details,
        imageUrl: createProductDto.imageUrl,
        organization: {
          connect: { id: createProductDto.organizationId },
        },
        type: {
          connect: { id: createProductDto.typeId },
        },
      };
      return this.productService.create(input);
    }

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

  @Post('/type')
  createType(@Body() createProductTypeDto: CreateProductTypeDto) {
    const input = {
      name: createProductTypeDto.name,
      organization: {
        connect: { id: createProductTypeDto.organizationId },
      },
    };
    return this.productService.createProductType(input);
  }

  @Get(':organizationId')
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('fields') fields?: string,
    @Query('include') include?: boolean,
  ) {
    return this.productService.find({
      fields,
      where: { organizationId },
      include: include,
    });
  }

  @Get('available/:organizationId')
  findAvailableProducts(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('include') include?: boolean,
  ) {
    return this.productService.findAvailableProducts({
      organizationId,
      include: include,
    });
  }

  @Get('types/:organizationId')
  findAllTypes(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('fields') fields?: string,
  ) {
    return this.productService.findTypes({
      fields,
      where: { organizationId },
    });
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
