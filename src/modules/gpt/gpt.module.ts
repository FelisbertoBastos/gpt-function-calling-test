import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { WeatherModule } from '../weather/weather.module';
import { InteractionsModule } from '../interactions/interactions.module';

@Module({
  imports: [WeatherModule, InteractionsModule],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
