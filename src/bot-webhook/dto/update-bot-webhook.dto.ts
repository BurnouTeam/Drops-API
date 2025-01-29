import { PartialType } from '@nestjs/mapped-types';
import { CreateBotWebhookDto } from './create-bot-webhook.dto';

export class UpdateBotWebhookDto extends PartialType(CreateBotWebhookDto) {}
