import { Module } from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';
import { BotWebhookController } from './bot-webhook.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [BotWebhookController],
  providers: [BotWebhookService],
})
export class BotWebhookModule {}
