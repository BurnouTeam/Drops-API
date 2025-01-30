import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  chatId: string; // WhatsApp chat session ID

  @IsOptional()
  @IsString()
  whatsappMessageId?: string; // Message ID from WhatsApp-web.js

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  fromMe?: boolean; // True if sent by the organization, False if from client

  @IsOptional()
  @IsString()
  status?: string; // "sent", "delivered", "read", "failed"

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  mediaType?: string; // "image", "video", "audio", "document"

  @IsOptional()
  @IsString()
  messageType?: string; // "text", "image", "video", "audio", "location", "sticker", "document"

  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  organizationId: number;
}
