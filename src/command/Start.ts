import { type Command } from './Command'
import { type CommandStructure } from '../types/CommandStructure'
import { type CommandResult } from '../types/CommandResult'

const forumManager = require('../forum/ForumManager').forumManager
const notificationChannelManager = require('../services/notification/NotificationChannelManager').notificationChannelManager

export class Start implements Command {
  public name: string
  public description: string
  public usage: string
  public options: undefined | Array<{ name: string, description: string, required: boolean }>

  constructor () {
    this.name = 'start'
    this.description = 'Create a notification stream to this channel for a specific forum community'
    this.usage = '/start <provider> <community>'
    this.options = [
      {
        name: 'provider',
        description: 'Forum provider, e.g.: commonwealth, cosmos-forum',
        required: true
      },
      {
        name: 'community',
        description: 'Forum community (for cosmos-forum set this to "cosmos"), e.g.: osmosis, juno, evmos',
        required: true
      }
    ]
  }

  async run (command: CommandStructure): Promise<CommandResult> {
    if (!command.userId || !command.channelId) { throw new Error('User ID or channel ID is missing.') }

    if (command.arguments.length < 2) {
      console.log(`[${command.platform}][Command: start] Missing arguments`, command)
      return {
        success: false,
        message: 'Missing arguments. Usage: start <provider> <community>. E.g.: /start commonwealth osmosis'
      }
    }
    const provider = command.arguments[0]
    const community = command.arguments[1]
    const forumProvider = forumManager.getProvider(provider)
    if (!forumProvider) {
      return {
        success: false,
        message: `Provider ${provider} not found. Providers: ${Object.keys(forumManager.getProviders()).join(', ')}`
      }
    }
    if (!forumProvider.getCommunities().includes(community)) {
      return {
        success: false,
        message: `Community ${community} not found from ${provider}. Current communities: ${forumProvider.getCommunities().join(', ')}`
      }
    }

    const user = await notificationChannelManager.getNotificationChannel(command.channelId, command.platform, provider, community)
    if (user) {
      return {
        success: true,
        message: 'Notification channel already exists.'
      }
    } else {
      await notificationChannelManager.createNotificationChannel(command.userId, command.channelId, command.platform, provider, community)
      return {
        success: true,
        message: `Notification channel created!\n\n
                    User Id: ${command.userId}\n 
                    Channel ID: ${command.channelId}\n
                    Platform: ${command.platform}\n
                    Provider: ${provider}\n
                    Community: ${community}`
      }
    }
  }
}
