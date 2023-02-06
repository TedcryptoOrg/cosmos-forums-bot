import * as dotenv from 'dotenv';
import {Message} from "./types/Message";
import TelegramProvider from "./notifier/provider/TelegramProvider";
import {TelegramClient} from "./clients/TelegramClient";
import {Notifier} from "./notifier/Notifier";
import {DiscordClient} from "./clients/DiscordClient";
import DiscordProvider from "./notifier/provider/DiscordProvider";

const path = require('path')

dotenv.config({debug: true, path: path.resolve(__dirname, '../.env')});

const database = require('./Database').database;
const forumManager = require('./forum/ForumManager').forumManager;

let notifier: Notifier;

const main = async () => {
    await database.connect();
    await database.initializeDB();
    console.log('Initialized database.');

    // Start clients
    let notifierClients = [];

    // Telegram
    const telegramToken = String(process.env.TELEGRAM_BOT_TOKEN)
    if ("" !== telegramToken) {
        console.log('Starting telegram client...');
        const telegramClient = new TelegramClient(telegramToken);
        await telegramClient.start();

        notifierClients.push(new TelegramProvider(telegramClient))
    }

    // Discord
    const discordBotToken = String(process.env.DISCORD_BOT_TOKEN)
    const discordClientId = String(process.env.DISCORD_CLIENT_ID);
    if ("" !== discordBotToken && "" !== discordClientId) {
        console.log('Starting discord client...');
        const discordClient = new DiscordClient(discordClientId, discordBotToken);
        await discordClient.start();

        notifierClients.push(new DiscordProvider(discordClient))
    }

    // Start the notifier
    notifier = new Notifier(notifierClients);
}

Promise.all([main()])
    .then(() => {
        const check = async () => {
            try {
                const providers = forumManager.getProviders();
                for (const providerName of Object.keys(providers)) {
                    const provider = providers[providerName];
                    const articles = await provider.getArticles();
                    for (const article of articles) {
                        console.log(`[${article.provider}] Fetched article "${article.title}" from "${article.community}"`);

                        const dbArticle = await database.getArticle(article.title, article.provider, article.community);
                        if (dbArticle) {
                            console.log('Topic "'+article.title+'" already exists. Skipping...')
                            continue;
                        }

                        console.log('Topic "'+article.title+'" does not exist. Adding...')
                        await database.insertArticle(article.title, article.url, article.provider, article.community);
                        const message: Message = {
                            text: `**New ${article.provider} - ${article.community} topic**\n\n`+
                                `Title: ${article.title}\n`+
                                `URL: ${article.url}`,
                            provider: article.provider,
                            community: article.community
                        }

                        await notifier.notify(message);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        check();

        setInterval(check, 60 * 1000);
    });