import { type Command } from './Command'
import { type CommandStructure } from '../types/CommandStructure'
import { type CommandResult } from '../types/CommandResult'

export class Help implements Command {
  public name: string
  public description: string
  public usage: string
  public options: undefined | Array<{ name: string, description: string, required: boolean }>

  constructor () {
    this.name = 'help'
    this.description = 'Show help for commands'
    this.usage = '/help'
    this.options = undefined
  }

  async run (command: CommandStructure): Promise<CommandResult> {
    if (!command.userId || !command.channelId) { throw new Error('User ID or channel ID is missing.') }

    const commands: Record<string, string> = {
      start: 'Start a notification channel. Usage: /start <provider> <community> (e.g.: /start commonwealth osmosis)',
      stop: 'Stop a notification channel. Usage: /stop <provider> <community> (e.g.: /stop commonwealth osmosis)',
      list: 'List providers or communities for a provider. Usage: /list or /list <provider> (e.g.: /list commonwealth)',
      help: 'Show help for commands. Usage: /help'
    }

    return {
      success: true,
      message: `Current commands:\n\n${Object.keys(commands).map((command) => `${command}: ${commands[command]}\n`).join(', ')}`
    }
  }
}
