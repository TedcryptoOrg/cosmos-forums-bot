import { type ClientInterface } from './ClientInterface'
import { Telegraf } from 'telegraf'
import { Platforms } from '../enums/Platforms'
import { Start } from '../command/Start'
import { type CommandStructure } from '../types/CommandStructure'
import { type Commands } from '../types/Commands'
import { Stop } from '../command/Stop'
import { Help } from '../command/Help'
import { List } from '../command/List'

export class TelegramClient implements ClientInterface {
  private readonly bot: Telegraf
  private readonly commands: Commands

  constructor (botToken: string) {
    this.bot = new Telegraf(botToken)
    this.commands = {
      start: new Start(),
      stop: new Stop(),
      help: new Help(),
      list: new List()
    }
  }

  async start (): Promise<void> {
    Object.keys(this.commands).forEach(commandName => {
      this.bot.command(commandName, async (ctx) => {
        console.log('Running command ' + commandName)
        const command = this.commands[commandName]
        if (!command) {
          console.log('Command not found!')
          return
        }

        const messageArguments = ctx.update.message.text.split(' ')
        // Remove command name
        messageArguments.shift()
        const commandStructure: CommandStructure = {
          command: commandName,
          arguments: messageArguments,
          platform: Platforms.Telegram,
          channelId: String(ctx.message.chat.id),
          userId: String(ctx.message.from?.id)
        }

        const result = await command.run(commandStructure)
        ctx.reply(result.message, { reply_to_message_id: ctx.update.message.message_id })
      })
    })

    this.bot.help((ctx) => {
      ctx.reply('Use the command /start with forum provider (cosmos-forum or commonwealth) and the community name to start receiving notifications.')
    })

    this.bot.launch()
  }

  async sendMessage (chatId: string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message)
  }

  getName (): Platforms {
    return Platforms.Telegram
  }
}
