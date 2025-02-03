import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('org')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/recieve')
  createRecievedMessage(@Body() createMessageDto: CreateMessageDto) {
    const input = {
      chatId: createMessageDto.chatId,
      whatsappMessageId: createMessageDto.whatsappMessageId,
      content: createMessageDto.content,
      fromMe: false,
      status: createMessageDto.status,
      mediaUrl: createMessageDto.mediaUrl,
      mediaType: createMessageDto.mediaType,
      messageType: createMessageDto.messageType,
      sentAt: createMessageDto.sentAt ?? new Date(),
      client: {
        connect: { phoneNumber: createMessageDto.clientId },
      },
      organization: {
        connect: { id: createMessageDto.organizationId },
      },
    };
    return this.messageService.create(input);
  }
  @Post('/sent')
  createSentMessage(@Body() createMessageDto: CreateMessageDto) {
    const input = {
      ...createMessageDto,
      content: createMessageDto.content,
      isSentByUser: createMessageDto.fromMe,
      sentAt: createMessageDto.sentAt ?? new Date(),
      fromMe: true,
      client: {
        connect: { phoneNumber: createMessageDto.clientId },
      },
      organization: {
        connect: { id: createMessageDto.organizationId },
      },
    };

    return this.messageService.create(input);
  }

  @Get(':organizationId/chat/:clientPhoneNumber/messages')
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('clientPhoneNumber') clientPhoneNumber: string,
    @Query('fields') fields?: string,
  ) {
    return this.messageService.find({
      fields,
      where: { organizationId, clientId: clientPhoneNumber },
      orderBy: { sentAt: 'desc' },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.update({
      where: { id, organizationId: updateMessageDto.organizationId },
      data: updateMessageDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.remove({ id });
  }
}
