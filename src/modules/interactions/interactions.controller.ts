import { Controller, Get, Param } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  // @Post()
  // addMessage() {
  //   return this.interactionsService.addMessage('user-id-test', {
  //     role: 'assistant',
  //     content: 'testando 4',
  //   });
  // }

  @Get('/:userId')
  getMessages(@Param('userId') userId: string) {
    return this.interactionsService.getMessages(userId);
  }
}
