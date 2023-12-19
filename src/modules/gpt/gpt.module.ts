import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
