import * as dotenv from 'dotenv';
import {Message} from "./types/Message";
import {Recipient} from "./types/Recipient";

const path = require('path')

dotenv.config({debug: true, path: path.resolve(__dirname, '../.env')});

const database = require('./Database').database;
const notifier = require('./notifier/Notifier').notifier;

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
                                const message: Message = {
                                    text: `**New ${provider.getName()} topic**\n\n`+
                                        `Title: ${article.title}\n`+
                                        `URL: ${article.url}`,
                                }
                                const recipient: Recipient = {
                                    id: user.id,
                                    options: {
                                        channel_id: user.channel_id
                                    }
                                }
                                await notifier.notify(message, recipient);
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

        check();

        setInterval(check, 60 * 1000);
    });