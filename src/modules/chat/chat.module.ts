import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { GptModule } from '../gpt/gpt.module';

@Module({
  imports: [GptModule],
  controllers: [ChatController],
})
export class ChatModule {}
