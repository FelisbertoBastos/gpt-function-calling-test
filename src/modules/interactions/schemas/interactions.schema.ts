import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  role: 'user' | 'assistant';

  @Prop()
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type InteractionDocument = HydratedDocument<Interaction>;

@Schema()
export class Interaction {
  @Prop()
  userId: string;

  @Prop({ type: [MessageSchema] })
  messages: Message[];
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);
