import { type ForumProvider } from './ForumProvider'
import { type Article } from '../../types/Article'
import { MD5 } from 'crypto-js'
import axios from 'axios'
import { ForumProviders } from '../../enums/ForumProviders'

const Parser = require('rss-parser')

export class MarsForum implements ForumProvider {
  private readonly parser: typeof Parser
  private currentHash: string

  constructor () {
    this.parser = new Parser()
    this.currentHash = ''
  }

  async getArticles (): Promise<Article[]> {
    const feedText = (await axios.get('https://forum.marsprotocol.io/latest.rss')).data
    const feed = await this.parser.parseString(feedText)
    const feedHash = MD5(feedText).toString()
    if (feedHash === this.currentHash) {
      console.log('[Mars Forum] No new articles found.')
      return []
    }

    this.currentHash = feedHash
    const articles: Article[] = []
    if (!feed.hasOwnProperty('items')) {
      console.log('[Mars Forum] No articles found.')
      return []
    }

    for (const item of feed.items) {
      if (!item.categories.find((str: string) => str.includes('MRC'))) {
        console.debug('[Mars Forum] Skipping article: ' + item.title + ' with categories: ' + item.categories.join(', '))
        continue
      }
      articles.push({
        title: item.title,
        url: item.link,
        community: 'mars',
        provider: this.getName()
      })
    }

    return articles
  }

  getCommunities (): string[] {
    return ['mars']
  }

  getName (): ForumProviders {
    return ForumProviders.MarsForum
  }
}
