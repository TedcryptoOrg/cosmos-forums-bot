import { type Command } from './Command'
import { type CommandStructure } from '../types/CommandStructure'
import { type CommandResult } from '../types/CommandResult'

const forumManager = require('../forum/ForumManager').forumManager

export class List implements Command {
  public name: string
  public description: string
  public usage: string
  public options: undefined | Array<{ name: string, description: string, required: boolean }>

  constructor () {
    this.name = 'list'
    this.description = 'Show list of providers or communities for a provider'
    this.usage = '/list or /list <provider>'
    this.options = [
      {
        name: 'provider',
        description: 'Forum provider, e.g.: commonwealth, cosmos-forum, discord-forum',
        required: false
      }
    ]
  }

  async run (command: CommandStructure): Promise<CommandResult> {
    if (!command.userId || !command.channelId) { throw new Error('User ID or channel ID is missing.') }

    if (command.arguments.length === 0) {
      return {
        success: true,
        message: `Current Providers: ${Object.keys(forumManager.getProviders()).join(', ')}`
      }
    }

    const provider = command.arguments[0]
    const forumProvider = forumManager.getProvider(provider)

    if (!forumProvider) {
      return {
        success: false,
        message: `Provider ${provider} not found. Providers: ${Object.keys(forumManager.getProviders()).join(', ')}`
      }
    }

    return {
      success: true,
      message: `Current communities for ${provider}: ${forumProvider.getCommunities().join(', ')}`
    }
  }
}
