import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { weatherFunction } from '../../gpt-functions/weather-function';
import { WeatherService } from '../weather/weather.service';
import { GPT } from '../../constants/gpt';

@Injectable()
export class GptService {
  private readonly openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly weatherService: WeatherService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
  }

  async getChatCompletions() {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'Dê respostas curtas.' },
      {
        role: 'user',
        content: 'Teresina é a capital de que estado?',
      },
    ];

    const message = await this.getCompletionMessage(messages);

    messages.push(message);

    if (message.function_call?.name === weatherFunction.name) {
      const { city } = JSON.parse(message.function_call.arguments);
      const weather = await this.weatherService.getWeather(city);

      messages.push({
        role: 'function',
        name: weatherFunction.name,
        content: JSON.stringify(weather),
      });

      const weatherGptResponse = await this.getCompletionMessage(messages);

      return weatherGptResponse.content;
    }

    return message.content;
  }

  private async getCompletionMessage(messages: ChatCompletionMessageParam[]) {
    const response = await this.openai.chat.completions.create({
      model: GPT.MODEL,
      messages,
      functions: [weatherFunction],
    });

    return response.choices[0].message;
  }
}
