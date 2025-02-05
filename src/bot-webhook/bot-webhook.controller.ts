import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

@Controller('bwh')
export class BotWebhookController {
  constructor(private readonly botWebhookService: BotWebhookService) {}

  @Post()
  handleWebhook(@Body() createEventDto: CreateEventDto) {
    this.botWebhookService.createWebhookEvent(createEventDto);
  }

  @Post('send')
  handleSendMessage(@Body() createMessage: CreateMessageDto) {
    this.botWebhookService.sendMessage(createMessage);
  }
}
