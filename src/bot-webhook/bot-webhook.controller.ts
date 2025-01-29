import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BotWebhookService } from './bot-webhook.service';
import { CreateBotWebhookDto } from './dto/create-bot-webhook.dto';
import { UpdateBotWebhookDto } from './dto/update-bot-webhook.dto';

@Controller('bot-webhook')
export class BotWebhookController {
  constructor(private readonly botWebhookService: BotWebhookService) {}

  @Post()
  create(@Body() createBotWebhookDto: CreateBotWebhookDto) {
    return this.botWebhookService.create(createBotWebhookDto);
  }

  @Get()
  findAll() {
    return this.botWebhookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botWebhookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotWebhookDto: UpdateBotWebhookDto) {
    return this.botWebhookService.update(+id, updateBotWebhookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botWebhookService.remove(+id);
  }
}
