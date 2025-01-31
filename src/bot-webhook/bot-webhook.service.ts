import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BotWebhookService {
  constructor(private eventEmitter: EventEmitter2) {}

  async processWebhookData(eventType: string, data: any) {
    this.eventEmitter.emit(eventType, data);
    console.log(
      `Received request for an event: ${eventType} with data: `,
      data,
    );
  }
}
