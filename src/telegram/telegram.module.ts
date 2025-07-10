import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { Job } from './entities/job.entity';
import { Banks_Account } from './entities/banksAccount.entity';
import { Profiles } from './entities/profiles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Banks_Account, Profiles]),
    Job,
    Banks_Account,
    Profiles,
    ScheduleModule.forRoot(),
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
