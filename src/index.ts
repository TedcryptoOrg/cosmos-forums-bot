import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
const path = require('path')

dotenv.config({debug: true, path: path.resolve(__dirname, '../.env')});

const database = require('./Database').database;
const bot = new Telegraf(String(process.env.BOT_TOKEN));

const providers = [
    require('./forum/provider/CosmosForum').cosmosForum
]

const main = async () => {
    await database.connect();
    await database.initializeDB();
    console.log('Initialized database.');
}

Promise.all([main()])
    .then(() => {
        const check = async () => {
            try {
                for (const provider of providers) {
                    const articles = await provider.getArticles();
                    for (const article of articles) {
                        console.log('Fetched article "'+article.title+'" from "'+provider.constructor.name+'"');
                        const dbArticle = await database.getArticle(article.title);
                        if (!dbArticle) {
                            console.log('Topic "'+article.title+'" does not exist. Adding...')
                            await database.insertArticle(article.title, article.url);
                            const users = await database.getAllUsers();
                            for (const user of users) {
                                await bot.telegram.sendMessage(
                                    user.channel_id,
                                    `**New ${provider.getName()} topic**\n\n`+
                                    `Title: ${article.title}\n`+
                                    `URL: ${article.url}`
                                );
                            }
                        } else {
                            console.log('Topic "'+article.title+'" already exists. Skipping...')
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        bot.start(async (ctx) => {
            ctx.reply('Hello ' + ctx.from.first_name + '!');
            if (!ctx.message) return;
            const userId = ctx.message.from?.id;
            const channelId = ctx.message.chat.id;
            if (!userId || !channelId) return;

            const user = await database.getUser(userId);
            if (user) {
                ctx.reply('User already exists.');
                return;
            } else {
                await database.createUser(userId, channelId);
                ctx.reply(`Saved user ID: ${userId} and channel ID: ${channelId}.`);
            }
        });
        bot.help((ctx) => {
            ctx.reply('Send /start to receive a greeting');
        });
        bot.launch();

        check();

        setInterval(check, 60 * 1000);
    });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));