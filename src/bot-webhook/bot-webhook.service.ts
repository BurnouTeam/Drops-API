import { Injectable } from '@nestjs/common';
import { CreateBotWebhookDto } from './dto/create-bot-webhook.dto';
import { UpdateBotWebhookDto } from './dto/update-bot-webhook.dto';

@Injectable()
export class BotWebhookService {
  create(createBotWebhookDto: CreateBotWebhookDto) {
    return 'This action adds a new botWebhook';
  }

  findAll() {
    return `This action returns all botWebhook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} botWebhook`;
  }

  update(id: number, updateBotWebhookDto: UpdateBotWebhookDto) {
    return `This action updates a #${id} botWebhook`;
  }

  remove(id: number) {
    return `This action removes a #${id} botWebhook`;
  }
}
