import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherApi } from 'src/constants/weather-api';

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}

  async getWeather(city: string) {
    const baseUrl = WeatherApi.BASE_URL;
    const weatherApiKey = this.configService.get<string>('WEATHER_API_KEY');

    const url = `${baseUrl}?q=${city}&appid=${weatherApiKey}&units=metric`;
    const { data } = await axios.get(url);

    return data;
  }
}
