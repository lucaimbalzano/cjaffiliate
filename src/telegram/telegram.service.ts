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
  // async readMessagesWithOptions(chatId: number, limit: number) {
  //   // Correctly define the peerId object
  //   const peerId = {
  //     channelId: chatId, // Use the chatId parameter to make the function dynamic
  //     className: 'PeerChannel',
  //   };

  //   // Fetch the messages
  //   const result = await this.client.getMessages(
  //     { peer: peerId },
  //     { limit: limit },
  //   );
  //   return result;
  // }

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
          const job = new Job();
          job.updatedAt = new Date();
          job.flow_process = 'TELEGRAM:LINK';
          job.fkProfiles = profile;
          job.channel_idMessage = idMessage;
          job.channel_message = message;
          job.channel_peerId = peerId;
          job.channel_editDate = editDate;
          await this.jobRepository.update(profile.id, job);
          return { result: true, link: message };
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

  async processMissions(): Promise<void> {
    //FLOW PROCESS
    // START CRON JOB to Recall the processMissions
    const profiles = await this.profilesRepository.find();
    for (let i = 0; i < profiles.length; i++) {
      let messageRetrieved = await this.getLastLinkMessageFromTheChannel(
        null,
        null,
        profiles[i] as Profiles,
      );
      // TELEGRAM LINK RETRIVED
      if (messageRetrieved.result) {
        // YOUTUBE AUTH
        console.log(
          '[LOGGER][' + i + ']Link message retrieved:',
          messageRetrieved.link,
        );
      } else {
        console.log('[LOGGER][' + i + '] No link message retrieved');
      }
    }
    //   const job = new Job();
    //   job.updatedAt = new Date();
    //   job.flow_process = 'STARTED';
    //   job.fkProfiles = profiles[i];
    //   await this.jobRepository.save(job);
    //YOUTUBE SCREEN
    //TELEGRAM PAY
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
// 5219882605 paymentbot --> channel id
// 2052204449 cjmaingroup -- channel id
