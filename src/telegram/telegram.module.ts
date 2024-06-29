import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { Job } from './entities/job.entity';
import { Banks_Account } from './entities/banksAccount.entity';
import { Profiles } from './entities/profiles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Banks_Account, Profiles]),
    Job,
    Banks_Account,
    Profiles,
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
