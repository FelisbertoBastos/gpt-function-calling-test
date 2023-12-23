import { IsNotEmpty, IsString } from 'class-validator';

export class GetChatCompletionDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
