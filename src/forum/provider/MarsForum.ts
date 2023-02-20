import {ForumProvider} from "./ForumProvider";
import {Article} from "../../types/Article";
import {MD5} from 'crypto-js';
import axios from "axios";
import {ForumProviders} from "../../enums/ForumProviders";

const Parser = require('rss-parser');

export class MarsForum implements ForumProvider {
    private parser: typeof Parser;
    private currentHash: string;

    constructor() {
        this.parser = new Parser();
        this.currentHash = '';
    }

    async getArticles(): Promise<Article[]> {
        const feedText = (await axios.get('https://forum.marsprotocol.io/latest.rss')).data;
        const feed = await this.parser.parseString(feedText);
        const feedHash = MD5(feedText).toString();
        if (feedHash === this.currentHash) {
            console.log('[Mars Forum] No new articles found.')
            return [];
        }

        this.currentHash = feedHash;
        let articles: Article[] = [];
        if (!feed.hasOwnProperty('items')) {
            console.log('[Mars Forum] No articles found.');
            return [];
        }

        for (const item of feed.items) {
            if (!item.category.includes('MRC')) {
                continue;
            }
            articles.push({
                title: item.title,
                url: item.link,
                community: 'mars',
                provider: this.getName(),
            });
        }

        return articles;
    }

    getCommunities(): string[] {
        return ['mars'];
    }

    getName(): ForumProviders {
        return ForumProviders.MarsForum;
    }
}
