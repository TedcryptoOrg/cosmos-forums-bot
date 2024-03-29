import * as dotenv from 'dotenv'
import * as Sentry from '@sentry/node'

import { type Message } from './types/Message'
import TelegramProvider from './notifier/provider/TelegramProvider'
import { TelegramClient } from './clients/TelegramClient'
import { Notifier } from './notifier/Notifier'
import { DiscordClient } from './clients/DiscordClient'
import DiscordProvider from './notifier/provider/DiscordProvider'
import { TwitterClient } from './clients/TwitterClient'
import TwitterProvider from './notifier/provider/TwitterProvider'
import { twitterClientManager } from './services/twitter/TwitterClientManager'
import { sequelize } from './sequelize'
import {DiscordForum} from "./forum/provider/DiscordForum";
const path = require('path')

dotenv.config({ debug: true, path: path.resolve(__dirname, '../.env') })

if (process.env.SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.SENTRY_ENVIRONMENT ?? undefined
  })
}

const forumManager = require('./forum/ForumManager').forumManager
const articleManager = require('./services/articles/ArticleManager').articleManager

let notifier: Notifier

const main = async () => {
  await sequelize.sync({ alter: true })
  // Start clients
  const notifierClients = []

  // Telegram
  const telegramEnabled = process.env.TELEGRAM_ENABLED ?? undefined
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN ?? undefined
  if (telegramEnabled === 'true' && telegramToken) {
    console.log('Starting telegram client...')
    try {
      const telegramClient = new TelegramClient(telegramToken)
      await telegramClient.start()

      notifierClients.push(new TelegramProvider(telegramClient))
    } catch (error) {
      console.error('Failed to load/start Telegram', error)
    }
    console.log('Started telegram client')
  }

  // Discord
  const discordEnabled = process.env.DISCORD_ENABLED ?? undefined
  const discordBotToken = process.env.DISCORD_BOT_TOKEN ?? undefined
  const discordClientId = process.env.DISCORD_CLIENT_ID ?? undefined
  let discordClient = undefined
  if (discordEnabled === 'true' && discordBotToken && discordClientId) {
    console.log('Starting discord client...')
    try {
      discordClient = new DiscordClient(discordClientId, discordBotToken)
      await discordClient.start()

      notifierClients.push(new DiscordProvider(discordClient))
    } catch (error) {
      console.error('Failed to load/start Discord', error)
    }
    console.log('Started discord client')
  }

  // Twitter
  const twitterEnabled = process.env.TWITTER_ENABLED ?? undefined
  const twitterClients = await twitterClientManager.getTwitterClients()
  if (twitterEnabled === 'true' && (twitterClients.length > 0)) {
    for (const configuration of twitterClients) {
      console.log('Starting "' + configuration.name + '" twitter client...')
      try {
        const twitterClient = new TwitterClient({
          consumerKey: configuration.consumer_key,
          consumerSecret: configuration.consumer_secret,
          accessToken: configuration.access_token,
          accessTokenSecret: configuration.access_token_secret,
          bearerToken: configuration.bearer_token
        })
        await twitterClient.start()

        notifierClients.push(new TwitterProvider(twitterClient, configuration.id))
      } catch (error) {
        console.error('Failed to load/start Twitter' + configuration.name, error)
      }
      console.log('Started "' + configuration.name + '" twitter client')
    }
  }

  // Add forum providers
  if (discordClient !== undefined) {
    forumManager.addProvider(new DiscordForum(discordClient));
  }

  // Start the notifier
  notifier = new Notifier(notifierClients)
}

Promise.all([main()])
  .then(() => {
    const check = async () => {
      Sentry.startTransaction({
        op: 'fetch_new_articles',
        name: 'Fetch new articles and notify'
      })

      try {
        const providers = forumManager.getProviders()
        for (const providerName of Object.keys(providers)) {
          const provider = providers[providerName]
          const articles = await provider.getArticles()
          for (const article of articles) {
            console.log(`[${article.provider}] Fetched article "${article.title}" from "${article.community}"`)

            const dbArticle = await articleManager.getArticle(article.title, article.provider, article.community)
            if (dbArticle) {
              console.log('Topic "' + article.title + '" already exists. Skipping...')
              continue
            }

            console.log('Topic "' + article.title + '" does not exist. Adding...')
            await articleManager.insertArticle(article.title, article.url, article.provider, article.community)
            const message: Message = {
              text: `**New ${article.provider} - ${article.community} topic**\n\n` +
                                `Title: ${article.title}\n` +
                                `URL: ${article.url}`,
              provider: article.provider,
              community: article.community
            }

            await notifier.notify(message)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    check()

    setInterval(check, 60 * 1000)
  })
