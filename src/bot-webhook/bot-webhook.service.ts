import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BotWebhookService {
  constructor(private eventEmitter: EventEmitter2) {}

  async processWebhookData(eventType: string, data: any) {
    console.log(
      `Received request for an event: ${eventType} with data: `,
      data,
    );
    this.eventEmitter.emit(eventType, data);
  }
}
