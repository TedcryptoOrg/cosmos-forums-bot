import * as sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import {channel} from "diagnostics_channel";

class Database {
    private connection: any;

    async connect() {
        this.connection = await open({
            filename: './data/rss_topics.sqlite',
            driver: sqlite3.Database
        });
    }

    async initializeDB() {
        this.connection.exec(
            `CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                url VARCHAR(255) NOT NULL,
                provider VARCHAR(255) NOT NULL,
                community VARCHAR(255) NOT NULL
            );`
        )
        this.connection.exec(
            `CREATE TABLE IF NOT EXISTS notification_channel (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(255) NOT NULL,
                channel_id VARCHAR(255) NOT NULL,
                platform VARCHAR(255) NOT NULL,
                provider VARCHAR(255) NOT NULL,
                community VARCHAR(255) NOT NULL
            );`
        )
    }

    async insertArticle(title: string, url: string, provider: string, community: string) {
        this.connection.run(
            `INSERT INTO articles (title, url, provider, community) VALUES (?, ?, ?, ?)`,
            [title, url, provider, community]
        );
    }

    async getArticle(title: string, provider: string, community: string): Promise<any> {
        return this.connection.get(
            `SELECT * FROM articles WHERE title = ? AND provider = ? AND community = ?`,
            [title, provider, community]
        );
    }

    async getNotificationChannel(channel_id: string, platform: string, provider: string, community: string): Promise<any> {
        return this.connection.get(
            `SELECT * FROM notification_channel WHERE channel_id = ? AND platform = ? AND provider = ? AND community = ?`,
            [channel_id, platform, provider, community]
        );
    }

    async createNotificationChannel(user_id: string, channel_id: string, platform: string, provider: string, community: string) {
        this.connection.run(
            `INSERT INTO notification_channel (user_id, channel_id, platform, provider, community) VALUES (?, ?, ?, ?, ?)`,
            [user_id, channel_id, platform, provider, community]
        );
    }

    async getAllNotificationChannels() {
        return this.connection.all(`SELECT * FROM notification_channel`);
    }

    async getAllNotificationChannelsForProviderAndCommunity(provider: string, community: string) {
        return this.connection.all(`SELECT * FROM notification_channel WHERE provider = ? AND community = ?`, [provider, community]);
    }
}

export const database = new Database();
