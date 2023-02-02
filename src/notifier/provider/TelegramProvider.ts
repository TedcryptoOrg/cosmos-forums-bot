import {NotifierProviderInterface} from "../NotifierProviderInterface";
import {Recipient} from "../../types/Recipient";
import {Message} from "../../types/Message";
import {TelegramClient} from "../../clients/TelegramClient";

export default class TelegramProvider implements NotifierProviderInterface {
  private readonly bot: TelegramClient;

  constructor(bot: TelegramClient) {
    this.bot = bot;
  }

  async send(message: Message, recipient: Recipient): Promise<void> {
    await this.bot.sendMessage(recipient.options['channel_id'], message.text);
  }
}