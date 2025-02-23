import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, Message, Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MessageWhereUniqueInput;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput;
    fields?: string;
  }): Promise<Partial<Message>[]> {
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

    return this.prisma.message.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: select
    });
  }

  async create(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.prisma.message.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }): Promise<Message> {
    const { where, data } = params;
    return this.prisma.message.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.MessageWhereUniqueInput): Promise<Message> {
    return this.prisma.message.delete({
      where,
    });
  }

  async getClientInfo( where: Prisma.ClientWhereUniqueInput): Promise<Partial<Client>> {
    return this.prisma.client.findUnique({
      where
    });
  }

  async getLatestMessagesByChat(organizationId: number): Promise<Partial<Message>[]> {
    return this.prisma.$queryRaw`
      SELECT
        m1.*,
        c.name AS "clientName",
        c."phoneNumber" AS "clientNumber",
        c."profilePhoto" AS "clientProfilePhoto"
      FROM "Message" m1
      INNER JOIN (
        SELECT "clientId", MAX("sentAt") AS latestMessageTime
        FROM "Message"
        WHERE "organizationId" = ${organizationId}
        GROUP BY "clientId"
      ) m2 ON m1."clientId" = m2."clientId" AND m1."sentAt" = m2.latestMessageTime
      JOIN "Client" c ON m1."clientId" = c."phoneNumber"
      WHERE m1."organizationId" = ${organizationId}
      ORDER BY m1."sentAt" DESC;
    `;
  }
}
