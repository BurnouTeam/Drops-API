import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('bwh')
export class BotWebhookController {
  constructor(private readonly botWebhookService: BotWebhookService) {}

  @Post()
  handleWebhook(@Body() createEventDto: CreateEventDto) {
    this.botWebhookService.createWebhookEvent(createEventDto);
  }
}
