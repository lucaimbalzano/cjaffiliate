import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SendMessageByUsername } from './dto/send-message-by-username.dto';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('initialize')
  async initialize() {
    await this.telegramService.initialize();
    return 'Initialized';
  }

  @Post('send/:chatId')
  async sendMessage(@Param('chatId') chatId: number) {
    await this.telegramService.sendMessageTest(chatId);
    return 'Message sent';
  }

  @Post('send-username/:username')
  async sendMessageToUsername(
    @Param('username') username: string,
    @Body('message') sender: SendMessageByUsername,
  ) {
    await this.telegramService.sendMessageToUsername(username, sender.message);
    return 'Message sent';
  }

  @Get('read/:chatId')
  async readMessages(@Param('chatId') chatId: number) {
    const messages = await this.telegramService.readMessages(chatId);
    return messages;
  }

  @Get('/get-all-chat-ids')
  async getAllChatIds() {
    return await this.telegramService.getAllChatIds();
  }

  @Get('/get-all-chats')
  async getAllChats() {
    return await this.telegramService.getAllChats();
  }

  @Get('/get-chat-id-by-username/:username')
  async getChatIdByUsername(@Param('username') username: string) {
    return await this.telegramService.getChatIdByUsername(username);
  }

  @Get('/start-worker')
  async startWorker() {
    return await this.telegramService.processMissions();
  }
}
