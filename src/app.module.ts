import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TelegramModule } from './telegram/telegram.module';
import { YoutubeModule } from './youtube/youtube.module';
import { TelegramService } from './telegram/telegram.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Profiles } from './telegram/entities/profiles.entity';
import { Banks_Account } from './telegram/entities/banksAccount.entity';
import { Job } from './telegram/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Banks_Account, Profiles]),
    Job,
    Banks_Account,
    Profiles,
    TelegramModule,
    YoutubeModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the module globally available
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log({
          host: configService.get<string>('DATABASE_HOST'),
          database: configService.get<string>('DATABASE_NAME'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
        });
        return {
          name: 'cjaffiliatedb',
          type: 'postgres',
          // url: configService.get<string>('DATABASE_URI'),
          host: configService.get<string>('DATABASE_HOST'),
          database: configService.get<string>('DATABASE_NAME'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          port: configService.get<number>('DATABASE_PORT'),
          entities: [Profiles, Banks_Account, Job],
          synchronize: true,
          logging: true,
        };
      },

      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        console.log('DATASOURCE: ' + dataSource);
        return dataSource;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService],
})
export class AppModule {}
