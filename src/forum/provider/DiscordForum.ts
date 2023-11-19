import { type ForumProvider } from './ForumProvider'
import { type Article } from '../../types/Article'
import { ForumProviders } from '../../enums/ForumProviders'
import {DiscordClient} from "../../clients/DiscordClient";
import {Collection, FetchedThreads, ForumChannel, Message, ThreadChannel} from "discord.js";

export class DiscordForum implements ForumProvider {
  private readonly discordClient: DiscordClient
  private readonly communities: {[key: string]: {channel_id: string}} = {
    kujira: {
      channel_id: '1175733196504186921',
    }
  }

  private lastThreads: {[key: string]: string} = {}

  constructor (discordClient: DiscordClient) {
    this.discordClient = discordClient
  }

  getCommunities (): string[] {
    return Object.keys(this.communities)
  }

  async getArticles (): Promise<Article[]> {
    const articles: Article[] = []
    for (const communityKey in this.communities) {
        const community = this.communities[communityKey]
        const threads = await this.fetchNewThreads(communityKey)
        if (threads === undefined) {
            continue
        }

        for (const thread of threads.threads.values()) {
            const title = thread.name
            articles.push({
                title,
                url: 'https://discord.com/channels/' + communityKey + '/' + community.channel_id + '/' + thread.id,
                community: communityKey,
                provider: this.getName()
            })
        }
    }

    return articles
  }

  getName (): ForumProviders {
    return ForumProviders.DiscordForum
  }

  fetchNewThreads = async (communityKey: string): Promise<FetchedThreads|undefined> => {
      const community = this.communities[communityKey];
      const threads = await this.fetchNewTopics(community.channel_id, this.lastThreads[communityKey])
      if (threads == undefined || threads.threads.size == 0) {
          console.log(`[${communityKey}] No threads found for community`)
          return
      }

      return threads
  }

  fetchNewTopics = async (channelId: string, lastMessageId: string|undefined): Promise<FetchedThreads|undefined> => {
    const channel = await this.discordClient.getClient().channels.fetch(channelId);
    if (!channel) {
      console.error(`Channel ${channelId} not found!`);
      return;
    }
    if (!channel.isTextBased) {
        console.error(`Channel ${channelId} is not a text channel!`);
        return;
    }
    if (!(channel instanceof ForumChannel)) {
        console.error(`Channel ${channelId} is not a thread channel!`, channel);
        return;
    }

    return channel.threads.fetchActive();
  };
}
