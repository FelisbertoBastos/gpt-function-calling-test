import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';
import { weatherFunctionSpec } from './functions/weather.function';
import { WeatherService } from '../weather/weather.service';
import { GPT } from '../../constants/gpt';
import { InteractionsService } from '../interactions/interactions.service';
import { RecipientChatMessage } from '../../dtos/recipient-chat-message.dto';

@Injectable()
export class GptService {
  private readonly openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly interactionsService: InteractionsService,
    private readonly weatherService: WeatherService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
  }

  async getChatCompletions(
    userId: string,
    userMessage: string,
  ): Promise<RecipientChatMessage> {
    await this.interactionsService.addMessage(userId, {
      role: 'user',
      content: userMessage,
    });

    const previousMessages = await this.interactionsService.getMessages(userId);

    const contextMessages: ChatCompletionMessageParam[] = [
      ...GPT.SYSTEM_INTRO_COMMANDS,
      ...previousMessages,
    ];

    const completionResponse = await this.getCompletionMessage(contextMessages);
    const completionMessage = completionResponse.message;

    contextMessages.push(completionMessage);

    const result = new RecipientChatMessage();

    switch (completionMessage.function_call?.name) {
      case weatherFunctionSpec.name:
        result.message = await this.handleWeatherRequest(
          userId,
          completionResponse,
          contextMessages,
        );
        break;
      default:
        await this.interactionsService.addMessage(userId, completionMessage);
        result.message = completionMessage.content;
        break;
    }

    return result;
  }

  private async getCompletionMessage(messages: ChatCompletionMessageParam[]) {
    const response = await this.openai.chat.completions.create({
      model: GPT.MODEL,
      messages,
      functions: [weatherFunctionSpec],
    });

    return response.choices[0];
  }

  private async handleWeatherRequest(
    userId: string,
    completionResponse: ChatCompletion.Choice,
    contextMessages: ChatCompletionMessageParam[],
  ) {
    const cities = [];

    do {
      const { city } = JSON.parse(
        completionResponse.message.function_call.arguments,
      );

      if (cities.includes(city.toLowerCase())) break;
      cities.push(city.toLowerCase());

      console.log(
        `Function: ${weatherFunctionSpec.name}\nArgs: ${JSON.stringify({
          city,
        })}`,
      );

      try {
        const weather = await this.weatherService.getWeather(city);

        contextMessages.push({
          role: 'function',
          name: weatherFunctionSpec.name,
          content: JSON.stringify(weather),
        });
      } catch (error) {
        contextMessages.push({
          role: 'function',
          name: weatherFunctionSpec.name,
          content: error.response.data.message,
        });
      }

      completionResponse = await this.getCompletionMessage(contextMessages);
    } while (completionResponse.finish_reason !== 'stop');

    const weatherGptResponse = completionResponse.message;

    await this.interactionsService.addMessage(userId, weatherGptResponse);

    return weatherGptResponse.content || '';
  }
}
