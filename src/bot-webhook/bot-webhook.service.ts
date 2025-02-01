import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class BotWebhookService {
  constructor(private eventEmitter: EventEmitter2) {}

  createWebhookEvent(event: CreateEventDto) {
    this.eventEmitter.emit(event.eventType, event.data);
  }
}
