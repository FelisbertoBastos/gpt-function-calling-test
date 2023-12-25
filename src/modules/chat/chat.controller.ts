import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from '../gpt/gpt.service';
import { SenderChatMessageDTO } from 'src/dtos/sender-chat-message.dto';
import { RecipientChatMessage } from 'src/dtos/recipient-chat-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly gptService: GptService) {}

  @Post()
  getChatCompletions(
    @Body() { userId, message }: SenderChatMessageDTO,
  ): Promise<RecipientChatMessage> {
    return this.gptService.getChatCompletions(userId, message);
  }
}
