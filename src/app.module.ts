import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GptModule } from './modules/gpt/gpt.module';
import { APP_PIPE } from '@nestjs/core';
import { InteractionsModule } from './modules/interactions/interactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_DB_URI');
        const user = configService.get<string>('MONGO_DB_USER');
        const pass = configService.get<string>('MONGO_DB_PASS');
        const dbName = configService.get<string>('MONGO_DB_NAME');

        return { uri, user, pass, dbName };
      },
    }),
    GptModule,
    InteractionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
