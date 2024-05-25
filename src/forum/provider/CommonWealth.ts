import axios from 'axios'

import { type ForumProvider } from './ForumProvider'
import { type Article } from '../../types/Article'
import { ForumProviders } from '../../enums/ForumProviders'

const API_HOST = 'https://commonwealth.im/external'

export interface QueryParams {
  page?: number
  count_only?: boolean
  limit?: number
  address_ids?: string[]
  addresses?: string[]
}

export interface CommunitiesParams extends QueryParams {
  community_id?: string
  network?: string
  comment_id?: string
}

export interface TopicsParams extends QueryParams {
  community_id: string
}

export interface ThreadsParams extends QueryParams {
  community_id: string
  topic_id?: string
  no_body?: boolean
  include_comments?: boolean
}

export interface Thread {
  id: number
  title: string
  address_id: number
  body?: string
  plaintext?: string
  kind: string
  stage: string
  url: string | null
  topic_id: number
  pinned: boolean
  chain: string
  read_only: boolean
  version_history: any[]
  snapshot_proposal: string | null
  has_poll: boolean | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  last_commented_on: string | null
}

export interface ApiResponseResult {
  threads?: Thread[]
  communities?: any
  topics?: any
  count: number
}

export interface ApiResponse {
  status: boolean
  result: ApiResponseResult
}

export class CommonWealth implements ForumProvider {
  private readonly restToken: string | null
  private readonly communities = [
    'stargaze',
    'juno',
    'evmos',
    'chihuahua',
    'bitsong-forum',
    'injective'
  ]

  private lastThreads: Record<string, number> = {}

  constructor (restToken: string | null = null) {
    this.restToken = restToken
  }

  getCommunities (): string[] {
    return this.communities
  }

  async fetchCommunities (params: CommunitiesParams = {}): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${API_HOST}/communities`, {
        params,
        headers: { apikey: `${this.restToken}` }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getTopics (params: TopicsParams): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${API_HOST}/topics`, {
        params,
        headers: { apikey: `${this.restToken}` }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getThreads (params: ThreadsParams): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${API_HOST}/threads`, {
        params,
        headers: { apikey: `${this.restToken}` }
      })

      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getArticles (): Promise<Article[]> {
    const articles: Article[] = []
    for (const community of this.communities) {
      const threads = await this.getThreads({
        community_id: community,
        no_body: true,
        include_comments: false
      })
      if ((threads.result?.threads) == null) {
        console.log(`[${community}] No threads found for community`)
        continue
      }
      if (this.lastThreads[community] === threads.result.threads[0].id) {
        console.log(`[${community}] No new threads found`)
        continue
      }
      this.lastThreads[community] = threads.result.threads[0].id

      for (const item of threads.result.threads) {
        let title = item.title
        try {
          title = decodeURIComponent(item.title)
        } catch (err) {
          // Ignore some titles are not encoded
        }
        articles.push({
          title,
          url: 'https://commonwealth.im/' + community + '/discussion/' + item.id,
          community,
          provider: this.getName()
        })
      }
    }

    return articles
  }

  getName (): ForumProviders {
    return ForumProviders.CommonWealth
  }
}
