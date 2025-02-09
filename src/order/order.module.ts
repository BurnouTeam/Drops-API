import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebsocketEventsGateway } from 'src/websocket/websocket.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService, WebsocketEventsGateway],
  exports: [OrderService],
})
export class OrderModule {}
