import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, Prisma } from '@prisma/client';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async client(
    clientWhereUniqueInput: Prisma.ClientWhereUniqueInput,
  ): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: clientWhereUniqueInput,
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClientWhereUniqueInput;
    where?: Prisma.ClientWhereInput;
    orderBy?: Prisma.ClientOrderByWithRelationInput;
    fields?: string;
  }): Promise<Partial<Client>[]> {
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

    return this.prisma.client.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return this.prisma.client.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.ClientWhereUniqueInput;
    data: Prisma.ClientUpdateInput;
  }): Promise<Client> {
    const { where, data } = params;
    return this.prisma.client.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.ClientWhereUniqueInput): Promise<Client> {
    return this.prisma.client.delete({
      where,
    });
  }

  async getDefaultOrder(params: { where: Prisma.ClientWhereUniqueInput }) {
    const { where } = params;
    const client = await this.prisma.client.findUnique({
      where,
      include: { defaultOrder: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client.defaultOrder;
  }

  async getNewClients(params: {
    data?: {
      time: string;
      organizationId: number;
    };
  }): Promise<{ clientsCount: number }> {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    const { data } = params;

    switch (data.time) {
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
      const allClientsCount = await this.prisma.client.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
          organizationId: data.organizationId,
        },
      });

      return {
        clientsCount: allClientsCount,
      };
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }
}
