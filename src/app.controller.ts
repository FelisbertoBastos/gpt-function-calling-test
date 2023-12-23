import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './modules/gpt/gpt.service';
import { GetChatCompletionDTO } from './dtos/get-chat-completion.dto';

@Controller()
export class AppController {
  constructor(private readonly gptService: GptService) {}

  @Post()
  getChatCompletions(
    @Body() { userId, message }: GetChatCompletionDTO,
  ): Promise<string> {
    return this.gptService.getChatCompletions(userId, message);
  }
}
