import {NotifierProviderInterface} from "../NotifierProviderInterface";
import {Recipient} from "../../types/Recipient";
import {Message} from "../../types/Message";
import {Platforms} from "../../enums/Platforms";
import {TwitterClient} from "../../clients/TwitterClient";

export default class TwitterProvider implements NotifierProviderInterface {
  private readonly bot: TwitterClient;
  private readonly twitterClientId: number;

  constructor(bot: TwitterClient, twitterClientId: number) {
    this.bot = bot;
    this.twitterClientId = twitterClientId;
  }

  async send(message: Message, recipient: Recipient): Promise<void> {
    if (recipient.options['channel_id'] !== this.twitterClientId) {
        console.log(`[TwitterProvider] Skipping message for user ${recipient.id} because it is not for the configured client.`);
        return;
    }

    await this.bot.sendMessage(recipient.options['channel_id'], message.text);
  }

  getClientName(): Platforms {
    return Platforms.Twitter;
  }
}