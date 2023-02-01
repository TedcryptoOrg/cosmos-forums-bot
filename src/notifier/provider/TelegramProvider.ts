import { Telegraf } from 'telegraf';
import {NotifierProviderInterface} from "../NotifierProviderInterface";
import {Recipient} from "../../types/Recipient";
import {Message} from "../../types/Message";
import {database} from "../../Database";

export default class TelegramProvider implements NotifierProviderInterface {
  private readonly bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(String(process.env.BOT_TOKEN));

    this.bot.start(async (ctx) => {
      ctx.reply('Hello ' + ctx.from.first_name + '!');
      if (!ctx.message) return;
      const userId = ctx.message.from?.id;
      const channelId = ctx.message.chat.id;
      if (!userId || !channelId) return;

      const user = await database.getUser(userId.toString());
      if (user) {
        ctx.reply('User already exists.');
        return;
      } else {
        await database.createUser(userId.toString(), channelId.toString());
        ctx.reply(`Saved user ID: ${userId} and channel ID: ${channelId}.`);
      }
    });

    this.bot.help((ctx) => {
      ctx.reply('Send /start to receive a greeting');
    });

    this.bot.launch();

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  async send(message: Message, recipient: Recipient): Promise<void> {
    await this.bot.telegram.sendMessage(recipient.options['channel_id'], message.text);
  }
}