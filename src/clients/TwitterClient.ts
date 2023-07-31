import { Client } from 'twitter.js'
import { type Commands } from '../types/Commands'
import { Platforms } from '../enums/Platforms'
import { type ClientInterface } from './ClientInterface'
import { type ClientCredentialsInterface } from 'twitter.js/dist/types/structures'

export class TwitterClient implements ClientInterface {
  private readonly client: Client
  private readonly configuration: ClientCredentialsInterface
  private readonly commands: Commands

  constructor (config: ClientCredentialsInterface) {
    this.client = new Client({ events: ['FILTERED_TWEET_CREATE'] })
    this.configuration = config
    this.commands = {}
  }

  async start (): Promise<void> {
    await this.client.login(this.configuration)
  }

  async sendMessage (option: any, text: string) {
    await this.client.tweets.create({
      text
    })
  }

  getName (): Platforms {
    return Platforms.Twitter
  }
}
