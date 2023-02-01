import {ForumProvider} from "./ForumProvider";
import {Article} from "../../types/Article";

const Parser = require('rss-parser');

class CosmosForum implements ForumProvider {
    private parser: typeof Parser;

    __constructor() {
        this.parser = new Parser();
    }

    async getArticles(): Promise<Article[]> {
        const parser = new Parser();
        const feed = await parser.parseURL('https://forum.cosmos.network/latest.rss');
        let articles: Article[] = [];
        for (const item of feed.items) {
            articles.push({
                title: item.title,
                url: item.link
            });
        }

        return articles;
    }

    getName(): string {
        return 'Cosmos Forum';
    }
}

module.exports.cosmosForum = new CosmosForum();
