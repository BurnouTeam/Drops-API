import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateEventDto } from './dto/create-event.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

@Injectable()
export class BotWebhookService {
  private readonly botApi: string;

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.botApi = this.configService.get<string>('BOT_API');
  }

  createWebhookEvent(event: CreateEventDto) {
    this.eventEmitter.emit(event.eventType, event.data);
  }

  async sendMessage(message: CreateMessageDto): Promise<any> {
    try {
      console.log(`${this.botApi}/send`);
      const response = this.httpService.post(
        `${this.botApi}/send`,
        message,
      );
      return response;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }
}
