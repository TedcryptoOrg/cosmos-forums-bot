import {NotifierProviderInterface} from "../NotifierProviderInterface";
import {Recipient} from "../../types/Recipient";
import {Message} from "../../types/Message";
import {DiscordClient} from "../../clients/DiscordClient";
import {Platforms} from "../../enums/Platforms";

export default class DiscordProvider implements NotifierProviderInterface {
  private readonly bot: DiscordClient;

  constructor(bot: DiscordClient) {
    this.bot = bot;
  }

  async send(message: Message, recipient: Recipient): Promise<void> {
    await this.bot.sendMessage(recipient.options['channel_id'], message.text);
  }

  getClientName(): Platforms {
    return Platforms.Discord;
  }
}