import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';

@Controller('bwh')
export class BotWebhookController {
  constructor(private readonly botWebhookService: BotWebhookService) {}
  @Post()
  async handleWebhook(
    @Body() payload: { eventType: string; data: any },
    @Headers('x-bot-signature') signature?: string,
  ) {
    const { eventType, data } = payload;

    if (!eventType || !data) {
      throw new BadRequestException('Missing eventType or data');
    }

    // if (!this.botWebhookService.verifySignature(payload, signature)) {
    //   throw new BadRequestException('Invalid Signature');
    // }

    await this.botWebhookService.processWebhookData(eventType, data);

    return {
      message: `Webhook event ${eventType} received and will be processed.`,
    };
  }
}
