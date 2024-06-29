import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { YoutubeModule } from './youtube/youtube.module';
import { TelegramService } from './telegram/telegram.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TelegramModule,
    YoutubeModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the module globally available
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService],
})
export class AppModule {}
