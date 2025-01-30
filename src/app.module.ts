import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { BotWebhookModule } from './bot-webhook/bot-webhook.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      newListener: true,
      removeListener: true,
      delimiter: '.',
    }),
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    ClientModule,
    OrganizationModule,
    BotWebhookModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
