import { Test, TestingModule } from '@nestjs/testing';
import { BotWebhookController } from './bot-webhook.controller';
import { BotWebhookService } from './bot-webhook.service';

describe('BotWebhookController', () => {
  let controller: BotWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotWebhookController],
      providers: [BotWebhookService],
    }).compile();

    controller = module.get<BotWebhookController>(BotWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
