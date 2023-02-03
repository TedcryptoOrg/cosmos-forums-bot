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
                url VARCHAR(255) NOT NULL
            );`
        )
        this.connection.exec(
            `CREATE TABLE IF NOT EXISTS notification_channel (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(255) NOT NULL,
                channel_id VARCHAR(255) NOT NULL,
                platform VARCHAR(255) NOT NULL
            );`
        )
    }

    async insertArticle(title: string, url: string) {
        this.connection.run(
            `INSERT INTO articles (title, url) VALUES (?, ?)`,
            [title, url]
        );
    }

    async getArticle(title: string): Promise<any> {
        return this.connection.get(
            `SELECT * FROM articles WHERE title = ?`,
            [title]
        );
    }

    async getNotificationChannel(channel_id: string, platform: string): Promise<any> {
        return this.connection.get(
            `SELECT * FROM notification_channel WHERE channel_id = ? AND platform = ?`,
            [channel_id, platform]
        );
    }

    async createNotificationChannel(user_id: string, channel_id: string, platform: string) {
        this.connection.run(
            `INSERT INTO notification_channel (user_id, channel_id, platform) VALUES (?, ?, ?)`,
            [user_id, channel_id, platform]
        );
    }

    async getAllNotificationChannels() {
        return this.connection.all(`SELECT * FROM notification_channel`);
    }
}

export const database = new Database();
