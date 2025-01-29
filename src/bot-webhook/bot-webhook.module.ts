import { Module } from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';
import { BotWebhookController } from './bot-webhook.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  controllers: [BotWebhookController],
  providers: [BotWebhookService, EventEmitter2],
})
export class BotWebhookModule {}
