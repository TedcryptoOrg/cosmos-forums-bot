import { type NotifierProviderInterface } from '../NotifierProviderInterface'
import { type Recipient } from '../../types/Recipient'
import { type Message } from '../../types/Message'
import { Platforms } from '../../enums/Platforms'
import { type TwitterClient } from '../../clients/TwitterClient'

export default class TwitterProvider implements NotifierProviderInterface {
  private readonly bot: TwitterClient
  private readonly twitterClientId: number

  constructor (bot: TwitterClient, twitterClientId: number) {
    this.bot = bot
    this.twitterClientId = twitterClientId
  }

  async send (message: Message, recipient: Recipient): Promise<void> {
    if (recipient.options.channel_id.toString() !== this.twitterClientId.toString()) {
      console.log(`[TwitterProvider] Skipping message for user ${recipient.id} because it is not for the configured client.`)
      return
    }

    await this.bot.sendMessage(recipient.options.channel_id, message.text)
  }

  getClientName (): Platforms {
    return Platforms.Twitter
  }
}
