/* eslint-disable prettier/prettier */
/*
 * God is Love.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramClient } from 'telegram';
import { StoreSession, StringSession } from 'telegram/sessions';
import PeerUser from 'telegram/tl/api';
import { Api } from 'telegram/tl';
import input from 'input';
import bigInt from 'big-integer';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { Banks_Account } from './entities/banksAccount.entity';
import { Profiles } from './entities/profiles.entity';
import { setTimeout } from 'node:timers/promises';
import {
  youtubeAuthentication,
  youtubeAuthenticationByFetch,
} from 'src/youtube/utils/functions';
import { BASE_URI_YT_CJ } from 'src/youtube/utils/costants';

@Injectable()
export class TelegramService {
  private client: TelegramClient;
  private storeSession: StoreSession;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Profiles)
    private profilesRepository: Repository<Profiles>,
    @InjectRepository(Banks_Account)
    private banksAccountRepository: Repository<Banks_Account>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {
    const apiId = this.configService.get<string>('TELEGRAM_API_ID');
    const apiHash = this.configService.get<string>('TELEGRAM_API_HASH');
    const storeSession = new StoreSession('store_session'); // You can save your session here

    this.client = new TelegramClient(storeSession, parseInt(apiId), apiHash, {
      connectionRetries: 5,
    });

    this.storeSession = storeSession;
  }

  async initialize() {
    console.log(`  

      ████████▓▓▓▓░░▒▒░░▒▒░░░░  ░░░░  ░░░░▒▒░░▒▒░░▓▓▓▓████████
      ██████▓▓▒▒▓▓▒▒  ▒▒░░░░  ░░    ░░  ░░░░▒▒  ▒▒▓▓▒▒▓▓██████
      ██▓▓██▓▓▓▓▒▒░░▒▒  ░░                ░░  ▒▒░░▒▒▓▓▓▓██▓▓██
      ██▓▓██▓▒▒=========== Initialization ===========▒▒▓██▓▓██
      `);
    await this.client.start({
      phoneNumber: '+393518279265', // async () => await input.text(' ██▓▒▒ Please enter your number, within your prefix: '),
      password: async () =>
        await input.text('██▓▒▒ Please enter your password: '),
      phoneCode: async () =>
        await input.text('██▓▒▒Please enter the code you received: '),
      onError: (err) => console.log(err),
    });

    console.log('You are now connected.');
    const dialog = await this.client.getDialogs({}); // when you login the first time
    console.log('Total Dialogs found:', dialog.length);
    // console.log(`StringSession: ${this.client.session.save()}`);
  }

  async initializeByNumber(number: string) {
    console.log(`  

      ████████▓▓▓▓░░▒▒░░▒▒░░░░  ░░░░  ░░░░▒▒░░▒▒░░▓▓▓▓████████
      ██████▓▓▒▒▓▓▒▒  ▒▒░░░░  ░░    ░░  ░░░░▒▒  ▒▒▓▓▒▒▓▓██████
      ██▓▓██▓▓▓▓▒▒░░▒▒  ░░                ░░  ▒▒░░▒▒▓▓▓▓██▓▓██
      ██▓▓██▓▒▒=========== Initialization ===========▒▒▓██▓▓██
      `);
    await this.client.start({
      phoneNumber: number,
      password: async () =>
        await input.text('██▓▒▒ Please enter your password: '),
      phoneCode: async () =>
        await input.text('██▓▒▒Please enter the code you received: '),
      onError: (err) => console.log(err),
    });

    console.log('You are now connected.');
    const dialog = await this.client.getDialogs({}); // when you login the first time
    console.log('Total Dialogs found:', dialog.length);
    // console.log(`StringSession: ${this.client.session.save()}`);
  }

  async sendMessageTest(chatId: number) {
    // Test purpose
    const msg = '👋🏼 Ciao! Come posso aiutarti oggi?';
    console.log('Sending message to chatId:', chatId, msg);
    const peerUser = new Api.PeerUser({ userId: bigInt(chatId) });
    let result = await this.client.getEntity(peerUser);
    await this.client.sendMessage(chatId, { message: msg });
  }

  async sendMessageToUsername(username: string, message: string) {
    const chatId = await this.getChatIdByUsername(username);
    await this.sendMessageTest(chatId);
  }

  async readMessages(chatId: number) {
    const result = await this.client.getMessages(chatId, { limit: 10 });
    return result;
  }

  async getMessagesByChanngelId(channelId: number, limit: number) {
    let messages;
    try {
      messages = await this.client.getMessages(channelId, {
        limit: limit,
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return false;
    }
    return messages;
  }

  async getAllChatIds() {
    const dialogs = await this.client.getDialogs();
    const chatIds = dialogs.map((dialog) => dialog.id);
    return chatIds;
  }

  async getAllChats() {
    const dialogs = await this.client.getDialogs();
    const chatIds = dialogs.map((dialog) => dialog.id);
    const allChats = [];
    let count = 0;
    for (const id of chatIds) {
      count++;
      if (count > 20) break;
      const result = await this.client.getMessages(id, { limit: 10 });
      allChats.push(result);
    }
    return allChats;
  }

  async getChatIdByUsername(username: string): Promise<number> {
    const result = await this.client.invoke(
      new Api.contacts.ResolveUsername({ username }),
    );
    if (result && result.users && result.users.length > 0) {
      return Number(result.users[0].id.toString());
    }
    throw new Error('User not found');
  }

  async getChatByChannelId() {
    let channelId;
    try {
      // channelId = bigInt('2052204449');
      // channelId = bigInt(2052204449)
      channelId = BigInt('2052204449');
      // const accessHashs = bigInt(1);
      const channel = await this.client.getEntity(channelId);
      console.log(channel);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    // const channel = await this.client.getEntity(channelId);
    // console.log(channel);
  }

  async getLastLinkMessageFromTheChannel(
    channelId: number,
    limit: number,
    profile: Profiles,
    job: Job,
  ): Promise<any> {
    try {
      const messagesCjMainGroup = await this.getMessagesByChanngelId(
        -1002052204449,
        100,
      );
      for (let i = 0; i < messagesCjMainGroup.length; i++) {
        if (messagesCjMainGroup[i].message.includes('🔼Missione video')) {
          console.log(
            '[LOGGER][' + i + '] Message:',
            messagesCjMainGroup[i].message,
          );
          const editDate = new Date(messagesCjMainGroup[i - 1].editDate * 1000);
          const idMessage = messagesCjMainGroup[i - 1].id;
          const message = messagesCjMainGroup[i - 1].message;
          const peerId = messagesCjMainGroup[i - 1].peerId;
          job.updatedAt = new Date();
          job.flow_process = 'TELEGRAM:LINK';
          job.fkProfiles = profile;
          job.channel_idMessage = idMessage;
          job.channel_message = message;
          job.channel_peerId = peerId;
          job.channel_editDate = editDate;
          await this.jobRepository.update(profile.id, job);
          return { result: true, link: message, idJob: job.id };
        }
      }
      return { result: false, link: '' };
    } catch (error) {
      console.error('Error fetching messages from channel:', error);
      const job = await this.jobRepository.findOne({
        where: { fkProfiles: profile },
      });
      job.flow_process = 'ERROR';
      job.errors = error.message;
      await this.jobRepository.update(profile.id, job);
      return { result: false, link: '' };
    }
  }

  async startJob(profile: Profiles) {
    const job = new Job();
    job.updatedAt = new Date();
    job.flow_process = 'STARTED';
    job.fkProfiles = profile;
    return await this.jobRepository.save(job);
  }

  async sendScreenshotToTelegram(
    chatId: number,
    pathToTheScreenshot: string,
    link: string,
  ) {
    const dialog = await this.client.getDialogs({});
    await this.client.sendMessage(chatId, {
      message: 'screenshot fatto;\n link: ' + link,
      file: pathToTheScreenshot,
    });
  }

  async processMissions(): Promise<void> {
    const profiles = await this.profilesRepository.find();
    for (let i = 0; i < profiles.length; i++) {
      const numberWithPrefix = profiles[i].prefix + profiles[i].number;
      await this.initializeByNumber(numberWithPrefix);
      const jobStarted = await this.startJob(profiles[i] as Profiles);
      const messageRetrieved = await this.getLastLinkMessageFromTheChannel(
        null,
        null,
        profiles[i] as Profiles,
        jobStarted as Job,
      );
      if (messageRetrieved.result) {
        console.log(
          '[LOGGER][' + i + ']Link message retrieved:',
          messageRetrieved.link,
        );

        const url =
          BASE_URI_YT_CJ +
          'like-and-screenshot?' +
          'email=' +
          profiles[i].email +
          '&password=' +
          profiles[i].password +
          '&link=' +
          messageRetrieved.link +
          '&id_profile=' +
          profiles[i].id +
          '&id_job=' +
          messageRetrieved.idJob;
        const pathToTheScreenshot = await youtubeAuthenticationByFetch(url);
        if (pathToTheScreenshot) {
          jobStarted.flow_process = 'YOUTUBE:AUTH:SCREEN';
          jobStarted.screenshot_folder = pathToTheScreenshot;
          jobStarted.updatedAt = new Date();
          await this.jobRepository.update(messageRetrieved.idJob, jobStarted);
          await this.sendScreenshotToTelegram(
            5219882605,
            pathToTheScreenshot,
            messageRetrieved.link,
          );

          jobStarted.flow_process = 'TELEGRAM:CHAT:PAY';
          jobStarted.screenshot_folder = pathToTheScreenshot;
          jobStarted.updatedAt = new Date();
          await this.jobRepository.update(messageRetrieved.idJob, jobStarted);

          setTimeout(220);
          const messages = await this.client.getMessages(5219882605, {
            limit: 5,
          });

          for (let i = 0; i < messages.length; i++) {
            if (messages[i].message.includes('Stipendio accumulato')) {
              jobStarted.flow_process = 'CLOSED';
              jobStarted.updatedAt = new Date();
              jobStarted.message = messages[i].message + ';';
              await this.jobRepository.update(
                messageRetrieved.idJob,
                jobStarted,
              );
            }
          }
        }
        await this.client.session.close();
      } else {
        console.log('[LOGGER][' + i + '] No link message retrieved');
        await this.client.session.close();
      }
    }
  }
}

// try {
/*
  Telegram
  *      "peerId": {
    "userId": "777000",
    "className": "PeerUser"
  },
  */
// 5219882605 paymentbot --> chat id
// 2052204449 cjmaingroup -- channel id
