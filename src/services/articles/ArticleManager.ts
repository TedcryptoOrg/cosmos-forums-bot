import { Article } from '../../models/Article'

class ArticleManager {
  async insertArticle (title: string, url: string, provider: string, community: string) {
    await Article.create({
      title,
      url,
      provider,
      community
    })
  }

  async getArticle (title: string, provider: string, community: string): Promise<Article | null> {
    return await Article.findOne({
      where: {
        title,
        provider,
        community
      }
    })
  }
}

export const articleManager = new ArticleManager()
