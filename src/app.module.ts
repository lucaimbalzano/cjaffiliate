import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [TelegramModule, YoutubeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
