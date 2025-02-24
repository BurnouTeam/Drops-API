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
import { HttpModule } from '@nestjs/axios';
import { WebsocketEventsGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      newListener: true,
      removeListener: true,
      delimiter: '.',
    }),
    ConfigModule.forRoot(),
    HttpModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    ClientModule,
    OrganizationModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
    MessageModule,
    BotWebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketEventsGateway],
})
export class AppModule {}
