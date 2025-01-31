import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';

@Controller('bwh')
export class BotWebhookController {
  constructor(private readonly botWebhookService: BotWebhookService) {}

  @Post()
  async handleWebhook(@Body() payload: { eventType: string; data: any }) {
    const { eventType, data } = payload;

    if (!eventType || !data) {
      throw new BadRequestException('Missing eventType or data');
    }

    await this.botWebhookService.processWebhookData(eventType, data);

    return {
      message: `Webhook event ${eventType} received and will be processed.`,
    };
  }
}
