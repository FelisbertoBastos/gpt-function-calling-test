import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interaction } from './schemas/interactions.schema';
import { MessageDTO } from './dtos/message.dto';
import { GPT } from '../../constants/gpt';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectModel(Interaction.name)
    private readonly interactionModel: Model<Interaction>,
  ) {}

  async addMessage(userId: string, message: MessageDTO): Promise<MessageDTO[]> {
    const interaction = await this.interactionModel
      .findOneAndUpdate(
        { userId },
        { $push: { messages: message } },
        { upsert: true, new: true },
      )
      .select({ messages: { $slice: -Math.abs(GPT.CONTEXT_SIZE) } });

    return interaction.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }

  async getMessages(userId: string): Promise<MessageDTO[]> {
    const interaction = await this.interactionModel.findOne({ userId });

    return interaction
      ? interaction.messages.map((message) => ({
          role: message.role,
          content: message.content,
        }))
      : [];
  }
}
