import * as sqlite3 from 'sqlite3'
import { open } from 'sqlite'

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
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(255) NOT NULL,
                channel_id VARCHAR(255) NOT NULL
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

    async getUser(user_id: string): Promise<any> {
        return this.connection.get(
            `SELECT * FROM users WHERE user_id = ?`,
            [user_id]
        );
    }

    async createUser(user_id: string, channel_id: string) {
        this.connection.run(
            `INSERT INTO users (user_id, channel_id) VALUES (?, ?)`,
            [user_id, channel_id]
        );
    }

    async getAllUsers() {
        return this.connection.all(`SELECT * FROM users`);
    }
}

export const database = new Database();
