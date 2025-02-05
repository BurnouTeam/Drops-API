import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma, ProductType } from '@prisma/client';
import { CreateProductWithTypeDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  createProductType(input: Prisma.ProductTypeCreateInput) {
    return this.prisma.productType.create({ data: input });
  }

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
    include?: boolean;
  }): Promise<Partial<Product>[]> {
    const { skip, take, cursor, where, orderBy, fields, include } = params;

    let queryOptions: any = { skip, take, cursor, where, orderBy };

    const relationsMap = {
      organizationId: 'organization',
      typeId: 'type',
    };

    if (fields) {
      queryOptions.select = fields.split(',').reduce(
        (acc, field) => {
          field = field.trim();
          if (relationsMap[field]) {
            acc[relationsMap[field]] = true; // Se for um ID, inclui o relacionamento
          } else {
            acc[field] = true;
          }
          return acc;
        },
        {} as Record<string, boolean>,
      );
    } else {
      // Se `fields` não for passado, retorna tudo, mas transformando IDs em objetos completos
      if (include) {
        queryOptions.include = Object.values(relationsMap).reduce(
          (acc, relation) => {
            acc[relation] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        );
      }
    }

    const results = await this.prisma.product.findMany(queryOptions);

    return results.map(({ ...data }) => {
      if (include) {
        Object.keys(data).forEach((key) => {
          if (key.endsWith('Id')) {
            delete data[key];
          }
        });
      }
      return data;
    });
  }

  async findTypes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    fields?: string;
    include?: boolean;
  }): Promise<Partial<ProductType>[]> {
    const { skip, take, cursor, where, orderBy, fields, include } = params;

    let queryOptions: any = { skip, take, cursor, where, orderBy };

    const relationsMap = {
      organizationId: 'organization',
    };

    if (fields) {
      queryOptions.select = fields.split(',').reduce(
        (acc, field) => {
          field = field.trim();
          if (relationsMap[field]) {
            acc[relationsMap[field]] = true; // Se for um ID, inclui o relacionamento
          } else {
            acc[field] = true;
          }
          return acc;
        },
        {} as Record<string, boolean>,
      );
    } else {
      queryOptions.include = Object.values(relationsMap).reduce(
        (acc, relation) => {
          acc[relation] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
    }

    const results = await this.prisma.productType.findMany(queryOptions);

    return results.map(({ ...data }) => {
      if (include) {
        Object.keys(data).forEach((key) => {
          if (key.endsWith('Id')) {
            delete data[key];
          }
        });
      }
      return data;
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async createProductAndType(data: CreateProductWithTypeDto): Promise<Product> {
    const { name } = data.type;
    let inputParams = {};

    const type = await this.prisma.productType.findFirst({
      where: {
        name: name.trim().toUpperCase(),
        organizationId: data.organizationId,
      },
    });

    if (type) {
      inputParams = {
        type: {
          connect: {
            id: type.id,
          },
        },
      };
    } else {
      inputParams = {
        type: {
          create: {
            name: name.trim().toUpperCase(),
            organization: {
              connect: {
                id: data.organizationId,
              },
            },
          },
        },
      };
    }

    return this.prisma.product.create({
      data: {
        name: data.name.trim(),
        price: data.price,
        quantity: data.quantity,
        details: data.details,
        imageUrl: data.imageUrl,
        organization: {
          connect: {
            id: data.organizationId,
          },
        },
        ...inputParams,
      },
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
