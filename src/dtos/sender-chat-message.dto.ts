import { IsNotEmpty, IsString } from 'class-validator';

export class SenderChatMessageDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
