import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientEventListener {
  private readonly logger = new Logger(ClientEventListener.name);
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.logger.log('ClientEventListener is registered!');
  }

  @OnEvent('client.update')
  async handleEvent(data: string) {
    this.logger.log(`Processing client.update event: ${data}`);
  }

  @OnEvent('*')
  handleWildcardEvent(payload: any, eventName: string) {
    this.logger.log(`🔥 Received event: ${eventName} with data:`, payload);
  }
}
