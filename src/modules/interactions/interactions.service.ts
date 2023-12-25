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

  async addMessage(userId: string, message: MessageDTO): Promise<boolean> {
    const interaction = await this.interactionModel.updateOne(
      { userId },
      { $push: { messages: message } },
      { upsert: true, new: true },
    );

    return interaction.acknowledged;
  }

  async getMessages(
    userId: string,
    limit: number = GPT.CONTEXT_SIZE,
  ): Promise<MessageDTO[]> {
    const interaction = await this.interactionModel
      .findOne({ userId })
      .select({ messages: { $slice: -Math.abs(limit) } });

    return interaction
      ? interaction.messages.map((message) => ({
          role: message.role,
          content: message.content,
        }))
      : [];
  }
}
