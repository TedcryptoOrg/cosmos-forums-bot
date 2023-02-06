import {ForumProvider} from "./ForumProvider";
import {Article} from "../../types/Article";
import {MD5} from 'crypto-js';
import axios from "axios";
import {ForumProviders} from "../../enums/ForumProviders";

const Parser = require('rss-parser');

export class CosmosForum implements ForumProvider {
    private parser: typeof Parser;
    private currentHash: string;

    constructor() {
        this.parser = new Parser();
        this.currentHash = '';
    }

    async getArticles(): Promise<Article[]> {
        const feedText = (await axios.get('https://forum.cosmos.network/latest.rss')).data;
        const feed = await this.parser.parseString(feedText);
        const feedHash = MD5(feedText).toString();
        if (feedHash === this.currentHash) {
            console.log('[Cosmos Forum] No new articles found.')
            return [];
        }

        this.currentHash = feedHash;
        let articles: Article[] = [];
        for (const item of feed.items) {
            articles.push({
                title: item.title,
                url: item.link,
                community: 'cosmos',
                provider: this.getName(),
            });
        }

        return articles;
    }

    getCommunities(): string[] {
        return ['cosmos'];
    }

    getName(): ForumProviders {
        return ForumProviders.CosmosForum;
    }
}
