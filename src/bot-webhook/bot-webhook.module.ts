import { Module } from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';
import { BotWebhookController } from './bot-webhook.controller';

@Module({
  controllers: [BotWebhookController],
  providers: [BotWebhookService],
})
export class BotWebhookModule {}
