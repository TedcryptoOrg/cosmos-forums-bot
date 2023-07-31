import { type ForumProvider } from './ForumProvider'
import { type Article } from '../../types/Article'
import { MD5 } from 'crypto-js'
import axios from 'axios'
import { ForumProviders } from '../../enums/ForumProviders'

const Parser = require('rss-parser')

export class AstroPortForum implements ForumProvider {
  private readonly parser: typeof Parser
  private currentHash: string

  constructor () {
    this.parser = new Parser()
    this.currentHash = ''
  }

  async getArticles (): Promise<Article[]> {
    const feedText = (await axios.get('https://forum.astroport.fi/latest.rss')).data
    const feed = await this.parser.parseString(feedText)
    const feedHash = MD5(feedText).toString()
    if (feedHash === this.currentHash) {
      console.log('[AstroPort Forum] No new articles found.')
      return []
    }

    this.currentHash = feedHash
    const articles: Article[] = []
    if (!feed.hasOwnProperty('items')) {
      console.log('[AstroPort Forum] No articles found.')
      return []
    }

    for (const item of feed.items) {
      if (!item.categories.find((str: string) => str.includes('ARC'))) {
        console.debug('[AstroPort Forum] Skipping article: ' + item.title + ' with categories: ' + item.categories.join(', '))
        continue
      }
      articles.push({
        title: item.title,
        url: item.link,
        community: 'astroport',
        provider: this.getName()
      })
    }

    return articles
  }

  getCommunities (): string[] {
    return ['astroport']
  }

  getName (): ForumProviders {
    return ForumProviders.AstroPortForum
  }
}
