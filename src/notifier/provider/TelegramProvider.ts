import { type NotifierProviderInterface } from '../NotifierProviderInterface'
import { type Recipient } from '../../types/Recipient'
import { type Message } from '../../types/Message'
import { type TelegramClient } from '../../clients/TelegramClient'
import { Platforms } from '../../enums/Platforms'

export default class TelegramProvider implements NotifierProviderInterface {
  private readonly bot: TelegramClient

  constructor (bot: TelegramClient) {
    this.bot = bot
  }

  async send (message: Message, recipient: Recipient): Promise<void> {
    await this.bot.sendMessage(recipient.options.channel_id, message.text)
  }

  getClientName (): Platforms {
    return Platforms.Telegram
  }
}
