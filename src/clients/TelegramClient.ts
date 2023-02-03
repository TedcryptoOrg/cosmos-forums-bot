import {ClientInterface} from "./ClientInterface";
import {Telegraf} from "telegraf";
import {database} from "../Database";
import {Platforms} from "../enums/Platforms";

export class TelegramClient implements ClientInterface {
    private bot: Telegraf;

    constructor(botToken: string) {
        this.bot = new Telegraf(botToken);
    }

    async start(): Promise<void> {
        this.bot.start(async (ctx) => {
            ctx.reply('Hello ' + ctx.from.first_name + '!');
            if (!ctx.message) return;
            const userId = ctx.message.from?.id;
            const channelId = ctx.message.chat.id;
            if (!userId || !channelId) return;

            const notificationChannel = await database.getNotificationChannel(channelId.toString(), this.getName())
            if (notificationChannel) {
                ctx.reply('Notification channel already exists.');
                return;
            } else {
                await database.createNotificationChannel(userId.toString(), channelId.toString(), this.getName());
                ctx.reply(`Notification channel created! User Id: ${userId}, Channel ID: ${channelId}, Platform: ${this.getName()}.`);
            }
        });

        this.bot.help((ctx) => {
            ctx.reply('Send /start to receive a greeting');
        });

        this.bot.launch();

        process.once('SIGINT', () => this.bot.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    }

    async sendMessage(chatId: string, message: string): Promise<void> {
        await this.bot.telegram.sendMessage(chatId, message);
    }

    getName(): Platforms {
        return Platforms.Telegram;
    }
}