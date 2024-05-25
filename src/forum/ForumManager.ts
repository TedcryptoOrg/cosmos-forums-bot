import { CommonWealth } from './provider/CommonWealth'
import { CosmosForum } from './provider/CosmosForum'
import { type ForumProvider } from './provider/ForumProvider'
import { MarsForum } from './provider/MarsForum'
import { AstroPortForum } from './provider/AstroPortForum'
import { OsmosisForum } from './provider/OsmosisForum'

class ForumManager {
  private readonly providers: Record<string, ForumProvider>

  constructor () {
    const providers = [
      new CommonWealth(),
      new CosmosForum(),
      new MarsForum(),
      new AstroPortForum(),
      new OsmosisForum()
    ]

    this.providers = {}
    for (const provider of providers) {
      this.providers[String(provider.getName())] = provider
    }
  }

  addProvider (provider: ForumProvider) {
    this.providers[String(provider.getName())] = provider
  }

  getProviders (): Record<string, ForumProvider> {
    return this.providers
  }

  getProvider (name: string): ForumProvider | null {
    return this.providers[name] || null
  }
}

export const forumManager = new ForumManager()
