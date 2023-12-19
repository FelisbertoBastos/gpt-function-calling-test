import { Controller, Get } from '@nestjs/common';
import { GptService } from './modules/gpt/gpt.service';

@Controller()
export class AppController {
  constructor(private readonly gptService: GptService) {}

  @Get()
  getChatCompletions(): Promise<string> {
    return this.gptService.getChatCompletions();
  }
}
